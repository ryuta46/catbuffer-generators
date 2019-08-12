from .SwiftFormatter import SwiftFormatter
from .SwiftFileGenerator import SwiftFileGenerator


class SwiftEnumClassGenerator(SwiftFileGenerator):
    def __init__(self, schema):
        self._schema = schema

        self._formatter = SwiftFormatter()

    def generate(self):
        primitive_type = self._schema.primitive_type
        self._formatter.begin_class_definition(
            class_name=self._schema.class_name,
            parents=[primitive_type],
            is_enum=True,
            comments=self._schema.comments)

        for enum_value in self._schema.enum_values:
            self._formatter.add_enum_value(enum_value.name, enum_value.value, enum_value.comments)

        self._formatter.end_class_definition()

        return self._formatter.get_generated()
