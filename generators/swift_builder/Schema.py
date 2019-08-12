import re

def get_primitive_type(value):
    is_unsigned = value['signedness'] == 'unsigned'
    size = value['size']
    type_map = {
        1: 'Int8',
        2: 'Int16',
        4: 'Int32',
        8: 'Int64'
    }
    return ('U' if is_unsigned else '') + type_map[size]


def is_primitive_type(value):
    return value['type'] == 'byte' and value['size'] in [1, 2, 4, 8]


def is_array_type(value):
    return 'size' in value and isinstance(value['size'], str)


class EnumValue:
    def __init__(self, value):
        self._value = value

    @property
    def name(self):
        return self._value['name']

    @property
    def value(self):
        return self._value['value']

    @property
    def comments(self):
        return self._value['comments']


class Field:
    def __init__(self, type_name, name, comments, array_target=None, const_value=None):
        self.type_name = type_name
        self.name = name
        self.comments = comments
        self.array_target = array_target
        self.const_value = const_value
        self.inline_roots = []
        self.condition_target = None
        self.condition_value = None

    @property
    def is_size(self):
        return self.name == 'size'

    @property
    def is_array_size(self):
        return self.name.endswith('Size') or self.name.endswith('Count')

    @property
    def is_array(self):
        return self.type_name.startswith('[') and self.type_name.endswith(']')

    @property
    def is_const(self):
        return self.const_value is not None

    @property
    def is_simple(self):
        return not self.is_size and not self.is_array_size and not self.is_const

    @property
    def has_condition(self):
        return self.condition_target is not None


class Schema:
    def __init__(self, name, value):
        self._name = name
        self._value = value
        self._expanded_fields = []

    @property
    def class_name(self):
        if self.is_primitive_type:
            return self._name
        elif self.is_byte_type:
            return self._name + 'Buffer'
        elif self.is_enum_type:
            return self._name
        else:
            return self._name + 'Builder'

    @property
    def comments(self):
        return self._value['comments']

    @property
    def is_byte_type(self):
        return self._value['type'] == 'byte'

    @property
    def is_primitive_type(self):
        return is_primitive_type(self._value)

    @property
    def is_struct_type(self):
        return self._value['type'] == 'struct'

    @property
    def is_enum_type(self):
        return self._value['type'] == 'enum'

    @property
    def size(self):
        return self._value['size']

    @property
    def is_unsigned(self):
        return self._value['signedness'] == 'unsigned'

    @property
    def primitive_type(self):
        return get_primitive_type(self._value)

    @property
    def enum_values(self):
        return list(map(lambda value: EnumValue(value), self._value['values']))

    @property
    def expanded_fields(self):
        return self._expanded_fields

    def expand_inline_fields(self, schema_list):
        self._expanded_fields = []

        for field in self._value['layout']:
            type_name = field['type']
            if 'disposition' in field and field['disposition'] == 'inline':
                inline_schema = Schema(type_name, schema_list[type_name])
                inline_schema.expand_inline_fields(schema_list)

                for inline_field in inline_schema.expanded_fields:
                    inline_field.inline_roots.append(inline_schema.class_name)
                    self._expanded_fields.append(inline_field)

            else:
                if is_primitive_type(field):
                    type_name = get_primitive_type(field)
                elif is_array_type(field):
                    if field['type'] == 'byte':
                        type_name = '[UInt8]'
                    else:
                        array_type_schema = Schema(type_name, schema_list[type_name])
                        type_name = '[{TYPE}]'.format(TYPE=array_type_schema.class_name)
                else:
                    schema = Schema(type_name, schema_list[type_name])

                    # Handles enum as a primitive value
                    if schema.is_enum_type:
                        type_name = schema.primitive_type
                    else:
                        type_name = schema.class_name

                const_value = None
                if 'disposition' in field and field['disposition'] == 'const':
                    const_value = field['value']
                    # convert entityType's name to 'type' for matching with Transaction's property.
                    if field['name'] == 'entityType' and field['type'] == 'EntityType':
                        field['name'] = 'type'

                new_field = Field(
                    type_name,
                    field['name'],
                    field['comments'],
                    const_value=const_value
                )

                # Search array size target
                if new_field.is_array_size:
                    target = next(filter(lambda f: 'size' in f and f['size'] == new_field.name, self._value['layout']),
                                  None)
                    new_field.array_target = None if target is None else target['name']

                if 'condition' in field and 'condition_value' in field:
                    condition_target_name = field['condition']
                    condition_value_raw = field['condition_value']
                    condition_value = condition_value_raw

                    condition_target_field = next(filter(lambda f: f['name'] == condition_target_name,
                                                         self._value['layout']), None)

                    if condition_target_field is not None:

                        # if condition target is enum, resolve the value
                        condition_target_schema = Schema(condition_target_field['type'],
                                                         schema_list[condition_target_field['type']])

                        if condition_target_schema.is_enum_type:
                            condition_value_enum = next(filter(lambda e: e.name == condition_value_raw,
                                                               condition_target_schema.enum_values), None)

                            if condition_value_enum is not None:
                                condition_value = condition_value_enum.value

                    new_field.condition_target = condition_target_name
                    new_field.condition_value = condition_value

                self.expanded_fields.append(
                    new_field
                )
