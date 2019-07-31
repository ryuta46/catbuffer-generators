from enum import Enum

from generators.Descriptor import Descriptor

from .typescript_builder.TypeScriptBlockGenerator import BlockType, TypeScriptBlockGenerator
from .typescript_builder.TypeScriptClassGenerator import TypeScriptClassGenerator
from .typescript_builder.TypeScriptFunctionGenerator import FunctionType, TypeScriptFunctionGenerator
from .typescript_builder.TypeScriptGeneratorUtils import indent


class TypeDescriptorDisposition(Enum):
    Inline = 'inline'
    Const = 'const'

class TypeDescriptorType(Enum):
    Byte = 'byte'
    Struct = 'struct'
    Enum = 'enum'

def _get_attribute_name_if_is_sizeof(attribute_name, attributes):
    for attribute_val in attributes:
        if 'size' in attribute_val and attribute_val['size'] == attribute_name:
            return attribute_val['name']
    return None


class TypeScriptGenerator:
    def __init__(self, schema, options):
        self.options = options
        self.schema = schema
        self.new_class = None
        self.current = None
        self.serialize_function = None
        self.load_from_binary_function = None
        self.exports = None
        self.imports = None

    def __next__(self):
        attribute = next(self.current)
        while self.schema[attribute]['type'] != 'struct' or self._is_inlined_in_schema(attribute):
            attribute = next(self.current)
        code = self.generate(attribute)
        return Descriptor('{}Buffer.ts'.format(attribute), code)

    def __iter__(self):
        self.current = iter(self.schema)
        return self

    def _is_inlined_in_schema(self, name):
        for schema_val in self.schema.values():
            if 'layout' in schema_val and \
               list(filter(lambda field: field['type'] == name and
                           'disposition' in field and field['disposition'] == 'inline', schema_val['layout'])) != []:
                return True
        return False

    def _get_type_size(self, attribute):
        if (
                attribute['type'] != TypeDescriptorType.Byte.value and
                attribute['type'] != TypeDescriptorType.Enum.value):
            return self.schema[attribute['type']]['size']
        return attribute['size']

    def _recursive_inlines_interation(self, attribute_function_generator, attributes):
        for attribute in attributes:
            if 'disposition' in attribute:
                if  TypeDescriptorDisposition.Inline.value == attribute['disposition']:
                    self._recursive_inlines_interation(attribute_function_generator, self.schema[attribute['type']]['layout'])
                elif  TypeDescriptorDisposition.Const.value == attribute['disposition']:
                    pass
            else:
                attribute_function_generator(attribute, _get_attribute_name_if_is_sizeof(attribute['name'], attributes))

    def _generate_load_from_binary_attributes(self, attribute, sizeof_attribute):
        class_name = self.new_class.class_name
        block = TypeScriptBlockGenerator()
        if sizeof_attribute is not None:
            block.add_instructions([
                'const {0} = bufferToUint(consumableBuffer.getBytes({1}))'
                .format(attribute['name'], attribute['size'])
            ])
        else:
            if attribute['type'] == TypeDescriptorType.Byte.value:
                block.add_instructions([
                    'const {0} = consumableBuffer.getBytes({1})'
                    .format(attribute['name'], self._get_type_size(attribute))
                ])
                block.add_instructions(['{0}.{1} = {1}'
                                        .format(class_name[0].lower() + class_name[1:], attribute['name'])])

            # Struct object
            else:
                # Required to check if typedef or struct definition (depends if type of typedescriptor is Struct or Byte)
                attribute_typedescriptor = self.schema[attribute['type']]

                # Array of objects
                if 'size' in attribute:
                    # No need to check if attribute['size'] is int (fixed) or a variable reference,
                    # because attribute['size'] will either be a number or a previously code generated reference
                    block.add_instructions(['{0}.{1} = []'
                                            .format(class_name[0].lower() + class_name[1:], attribute['name'])])
                    for_block_generator = TypeScriptBlockGenerator()
                    for_block_generator.wrap(BlockType.FOR, '< {}'.format(attribute['size']), 'i')
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        for_block_generator.add_instructions(
                            ['const new{0} = {1}.loadFromBinary(consumableBuffer)'.format(
                                attribute['name'], TypeScriptClassGenerator.get_generated_class_name(attribute['type'])
                            )]
                        )
                        self.imports['./{}Buffer.ts'.format(attribute['type'])] = '{{ {}Buffer }}'.format(attribute['type'])
                    elif attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value:
                        for_block_generator.add_instructions(
                            ['const new{0} = consumableBuffer.getBytes({1})'.format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )]
                        )
                    for_block_generator.add_instructions(['{0}.{1}.push(new{1})'
                                                          .format(class_name[0].lower() + class_name[1:], attribute['name'])])
                    block.add_block(for_block_generator)

                # Is single object
                else:
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        block.add_instructions([
                            'const {0} = {1}.loadFromBinary(consumableBuffer)'
                            .format(
                                attribute['name'], TypeScriptClassGenerator.get_generated_class_name(attribute['type'])
                            )
                        ])
                        self.imports['./{}Buffer.ts'
                                     .format(attribute['type'])] = '{{ {}Buffer }}'.format(attribute['type'])
                    elif (
                            attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value
                            or
                            attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value
                    ):
                        block.add_instructions([
                            'const {0} = consumableBuffer.getBytes({1})'
                            .format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )
                        ])
                    block.add_instructions(['{0}.{1} = {1}'.format(class_name[0].lower() + class_name[1:], attribute['name'])])

        if 'condition' in attribute:
            block.wrap(BlockType.IF, '{0} === \'{1}\''.format(attribute['condition'], attribute['condition_value']))

        self.load_from_binary_function.add_instructions(block.get_instructions())

    def _generate_load_from_binary_function(self, attributes):
        class_name = self.new_class.class_name
        self.load_from_binary_function = TypeScriptFunctionGenerator(FunctionType.STATIC)
        self.load_from_binary_function.set_return_type(': ' + class_name)
        self.load_from_binary_function.set_name('loadFromBinary')
        self.load_from_binary_function.set_params(['consumableBuffer'])
        self.load_from_binary_function.add_instructions(['const {0} = new {1}()'
                                                         .format(class_name[0].lower() + class_name[1:], class_name)])
        self._recursive_inlines_interation(self._generate_load_from_binary_attributes, attributes)
        self.load_from_binary_function.add_instructions(['return {}'.format(class_name[0].lower() + class_name[1:])])
        self.new_class.add_function(self.load_from_binary_function)

    def _generate_serialize_attributes(self, attribute, sizeof_attribute_name):
        if sizeof_attribute_name is not None:
            self.serialize_function.add_instructions([
                'newArray = concatTypedArrays(newArray, uintToBuffer(this.{0}.length, {1}))'
                .format(sizeof_attribute_name, attribute['size'])])
        else:
            if attribute['type'] == TypeDescriptorType.Byte.value:
                if isinstance(attribute['size'], int):
                    self.serialize_function.add_instructions([
                        'const {0} = fitByteArray(this.{0}, {1})'
                        .format(attribute['name'], self._get_type_size(attribute))
                    ])
                    self.serialize_function.add_instructions([
                        'newArray = concatTypedArrays(newArray, {})'
                        .format(attribute['name'])
                    ])
                else:
                    self.serialize_function.add_instructions(['newArray = concatTypedArrays(newArray, this.{})'
                                                              .format(attribute['name'])])

            # Struct object
            else:
                # Required to check if typedef or struct definition (depends if type of typedescriptor is Struct or Byte)
                attribute_typedescriptor = self.schema[attribute['type']]

                # Array of objects
                if 'size' in attribute:
                    # No need to check if attribute['size'] is int (fixed) or a variable reference,
                    # because we iterate with a for util in both cases
                    for_loop_block = TypeScriptBlockGenerator()
                    for_loop_block.wrap(BlockType.FOR, '< this.{}.length'.format(attribute['name']), 'i')
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        for_loop_block.add_instructions(
                            ['newArray = concatTypedArrays(newArray, this.{0}[{1}].serialize())'
                             .format(attribute['name'], for_loop_block.iterator)]
                        )
                    elif attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value:
                        for_loop_block.add_instructions(
                            ['const {0} = fitByteArray(this.{0}, {1})'.format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )]
                        )
                        for_loop_block.add_instructions(
                            ['newArray = concatTypedArrays(newArray, {})'.format(attribute['name'])]
                        )
                    self.serialize_function.add_block(for_loop_block)

                # Single object
                else:
                    if attribute_typedescriptor['type'] == TypeDescriptorType.Struct.value:
                        self.serialize_function.add_instructions([
                            'newArray = concatTypedArrays(newArray, this.{}.serialize())'
                            .format(attribute['name'])
                        ])
                    elif (
                            attribute_typedescriptor['type'] == TypeDescriptorType.Enum.value
                            or attribute_typedescriptor['type'] == TypeDescriptorType.Byte.value
                    ):
                        self.serialize_function.add_instructions([
                            'const {0} = fitByteArray(this.{0}, {1})'
                            .format(
                                attribute['name'], self._get_type_size(attribute_typedescriptor)
                            )
                        ])
                        self.serialize_function.add_instructions([
                            'newArray = concatTypedArrays(newArray, {})'
                            .format(attribute['name'])
                        ])

    def _generate_serialize_function(self, attributes):
        self.serialize_function = TypeScriptFunctionGenerator()
        self.serialize_function.set_return_type(': Uint8Array')
        self.serialize_function.set_name('serialize')
        self.serialize_function.add_instructions(['let newArray;'])
        self._recursive_inlines_interation(self._generate_serialize_attributes, attributes)
        self.serialize_function.add_instructions(['return newArray'])
        self.new_class.add_function(self.serialize_function)

    def _generate_local_var(self, attribute, sizeof_attribute_name):
        if sizeof_attribute_name is None:
            self.new_class.add_local_var(attribute)

    def _generate_attributes(self, attribute, sizeof_attribute_name):
        if sizeof_attribute_name is None:
            self.new_class.add_getter_setter(attribute['name'])

    def _generate_schema(self, type_descriptor, schema_value):
        self.new_class = TypeScriptClassGenerator(type_descriptor)
        self.exports.append(self.new_class.class_name)
        self._recursive_inlines_interation(self._generate_local_var, schema_value['layout'])
        self._generate_load_from_binary_function(schema_value['layout'])
        self._recursive_inlines_interation(self._generate_attributes, schema_value['layout'])
        self._generate_serialize_function(schema_value['layout'])
        return self.new_class.get_instructions()

    def _generate_module_exports(self):
        return ['module.exports = {'] + indent([export + ',' for export in self.exports]) + ['};']

    def generate(self, name):
        self.exports = []
        self.imports = {}

        new_file_lines = ['/*** File automatically generated by Catbuffer ***/', '']

        imported_utils = '{ concatTypedArrays, fitByteArray, Uint8ArrayConsumableBuffer, bufferToUint, uintToBuffer }'
        self.imports['./TypeScriptUtils.ts'] = imported_utils

        schema_type_value = self.schema[name]['type']
        if schema_type_value == TypeDescriptorType.Byte.value:
            # Typeless environment, values will be directly assigned
            pass
        elif schema_type_value == TypeDescriptorType.Enum.value:
            # Using the constant directly, so enum definition unneeded
            pass
        elif schema_type_value == TypeDescriptorType.Struct.value:
            generated_code = self._generate_schema(name, self.schema[name]) + ['']
            for import_file, import_value in self.imports.items():
                new_file_lines.append('import {0} from \'{1}\''.format(import_value, import_file.replace('.ts', '')))
            new_file_lines += [''] + generated_code
        return new_file_lines
