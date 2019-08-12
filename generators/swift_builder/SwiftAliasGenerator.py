
from .SwiftFormatter import SwiftFormatter
from .SwiftFileGenerator import SwiftFileGenerator


class SwiftAliasGenerator(SwiftFileGenerator):
    def __init__(self, schema):
        self._schema = schema
        self._formatter = SwiftFormatter()

    def generate(self):
        primitive_type = self._schema.primitive_type
        self._formatter.add_typealias(self._schema.class_name, primitive_type)

        return self._formatter.get_generated()
