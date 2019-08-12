from .SwiftFormatter import Argument, SwiftFormatter
from .SwiftFileGenerator import SwiftFileGenerator


class SwiftStructClassGenerator(SwiftFileGenerator):
    def __init__(self, schema):
        self._schema = schema

        self._formatter = SwiftFormatter()
        self._parent = ''
        class_name = self._schema.class_name
        if class_name != 'EmbeddedTransactionBuilder' and class_name.endswith('TransactionBuilder'):
            if class_name.startswith('Embedded'):
                self._parent = 'EmbeddedTransactionBuilder'
            elif class_name != 'TransactionBuilder':
                self._parent = 'TransactionBuilder'

    @property
    def has_parent(self):
        return len(self._parent) > 0

    def generate(self):
        self._formatter.begin_class_definition(
            class_name=self._schema.class_name,
            parents=['Serializer', 'Deserializer'] if not self.has_parent else [self._parent],
            comments=self._schema.comments)

        # only simple fields are included as properties in the class.
        initializer_arguments = []
        self_initialized_fields = []
        super_initialized_fields = []

        for constant_field in list(filter(lambda _field: _field.is_const, self._schema.expanded_fields)):
            self._formatter.add_constant(
                type_name=constant_field.type_name,
                name=constant_field.name,
                value=constant_field.const_value,
                comments=constant_field.comments
            )

        for field in filter(lambda _field: _field.is_simple, self._schema.expanded_fields):
            type_name = field.type_name + ('?' if field.has_condition else '')
            argument = Argument(type_name, field.name)

            # Do not add parents property
            if self._parent not in field.inline_roots:
                self._formatter.add_property(
                    type_name,
                    field.name,
                    is_mutable=True,
                    comments=field.comments)

                self_initialized_fields.append(field)
            else:
                super_initialized_fields.append(field)

            initializer_arguments.append(argument)

        initializer_body = []
        initializer_body.extend(list(map(lambda _argument: 'self.{NAME} = {NAME}'.format(NAME=_argument.name),
                                         self_initialized_fields)))

        if len(super_initialized_fields) > 0:
            initializer_body.append('super.init({ARGUMENTS})'.format(
                ARGUMENTS=', '.join(map(lambda f: '{NAME}: {VALUE}'.format(
                    NAME=f.name,
                    VALUE=f.name if not f.is_const else f.const_value
                ), super_initialized_fields))
            ))

        self._formatter.add_initializer(
            arguments=initializer_arguments,
            method_body=initializer_body)
        self._add_size_property()
        self._add_serialize_method()
        self._add_deserialize_method()

        self._formatter.end_class_definition()

        return self._formatter.get_generated()

    def _add_size_property(self):
        # Add size method
        method_body = ['var size = ' + ('super.size' if self.has_parent else '0')]
        for field in self._schema.expanded_fields:
            if self._parent in field.inline_roots:
                # Skip field in parent class
                continue

            if field.is_size or field.is_array_size:
                method_body.append('size += {TYPE_NAME}().size // for {NAME}'.format(
                    TYPE_NAME=field.type_name,
                    NAME=field.name
                ))
            elif field.is_simple:
                if field.has_condition:
                    method_body.append('if {TARGET} == {VALUE} {{ size += self.{NAME}!.size }}'.format(
                        TARGET=field.condition_target,
                        VALUE=field.condition_value,
                        NAME=field.name))
                else:
                    method_body.append('size += self.{NAME}.size'.format(NAME=field.name))
        method_body.append('return size')

        self._formatter.add_computed_property(
            type_name='Int',
            name='size',
            method_body=method_body,
            modifier='public' + (' override' if self.has_parent else '')
        )

    def _add_serialize_method(self):
        # Add serialize method
        method_body = ['var serialized: [UInt8] = ' + ('super.serialize()' if self.has_parent else '[]')]
        for field in self._schema.expanded_fields:
            if self._parent in field.inline_roots:
                # Skip field in parent class
                continue

            if field.is_size:
                method_body.append('serialized += {TYPE_NAME}(self.size).serialize()'.format(TYPE_NAME=field.type_name))
            elif field.is_array_size:
                method_body.append('serialized += {TYPE_NAME}(self.{TARGET_NAME}.count).serialize()'.format(
                    TYPE_NAME=field.type_name,
                    TARGET_NAME=field.array_target))
            elif field.is_simple:
                if field.has_condition:
                    method_body.append('if {TARGET} == {VALUE} {{ serialized += self.{NAME}!.serialize() }}'.format(
                        TARGET=field.condition_target,
                        VALUE=field.condition_value,
                        NAME=field.name))
                else:
                    method_body.append('serialized += self.{NAME}.serialize()'.format(NAME=field.name))
        method_body.append('return serialized')

        self._formatter.add_method_definition(
            method_name='serialize',
            arguments=[],
            method_body=method_body,
            return_type='[UInt8]',
            modifier='public' + (' override' if self.has_parent else '')
        )

    def _add_deserialize_method(self):

        method_body = []
        for field in self._schema.expanded_fields:
            if field.is_array:
                array_size_field = next(
                    filter(lambda f: f.is_array_size and f.array_target == field.name, self._schema.expanded_fields),
                    None)
                if array_size_field is not None:
                    method_body.append(
                        'let {NAME} = try {TYPE_NAME}.createFrom(stream: stream, count: Int({COUNT}))'.format(
                            NAME=field.name,
                            TYPE_NAME=field.type_name,
                            COUNT=array_size_field.name
                        ))
            elif not field.is_const:
                if field.has_condition:
                    method_body.append(
                        'let {NAME} = {TARGET} == {VALUE} ? try {TYPE_NAME}.createFrom(stream: stream): nil'.format(
                            TARGET=field.condition_target,
                            VALUE=field.condition_value,
                            NAME=field.name,
                            TYPE_NAME=field.type_name)
                    )
                else:
                    method_body.append('let {NAME} = try {TYPE_NAME}.createFrom(stream: stream)'.format(
                        NAME=field.name,
                        TYPE_NAME=field.type_name))

        initializer_argument_names = list(
            map(lambda _field: _field.name,
                filter(lambda _field: _field.is_simple, self._schema.expanded_fields)
                )
        )
        method_body.append('return unsafeDowncast({CLASS_NAME}({ARGUMENTS}), to: self)'.format(
            CLASS_NAME=self._schema.class_name,
            ARGUMENTS=', '.join(map(lambda _arg: '{NAME}: {NAME}'.format(NAME=_arg), initializer_argument_names))
        ))

        self._formatter.add_method_definition(
            method_name='createFrom',
            arguments=[Argument("InputStream", "stream")],
            method_body=method_body,
            modifier='public class {OVERRIDE}'.format(
                OVERRIDE='override' if self.has_parent else ''
            ),
            return_type='Self',
            throws=True
        )

