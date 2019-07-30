from .Helpers import get_builtin_type, indent, get_attribute_size, is_flags_enum, get_comments_from_attribute
from .Helpers import get_comments_if_present, create_enum_name, InterfaceType
from .Helpers import get_read_method_name, get_reverse_method_name, get_write_method_name
from .TypescriptGeneratorBase import TypescriptGeneratorBase
from .TypescriptMethodGenerator import TypescriptMethodGenerator


def get_type(attribute):
    return get_builtin_type(attribute['size'])


class TypescriptEnumGenerator(TypescriptGeneratorBase):
    """Typescript enum generator"""

    def __init__(self, name, schema, class_schema):
        super(TypescriptEnumGenerator, self).__init__(name, schema, class_schema)
        self.enum_values = {}
        self.class_type = 'enum'
        self._add_enum_values(self.class_schema)

    def _add_private_declaration(self):
        pass

    def _add_enum_values(self, enum_attribute):
        enum_attribute_values = enum_attribute['values']
        for current_attribute in enum_attribute_values:
            self.add_enum_value(current_attribute['name'], current_attribute['value'],
                                get_comments_from_attribute(current_attribute, False))

    def _write_enum_values(self):
        count = 1
        for name, value_comments in self.enum_values.items():
            value, comments = value_comments
            comment_line = get_comments_if_present(comments)
            if comment_line is not None:
                self.class_output += [indent(comment_line)]
            line = '{0} = {1}'.format(name.upper(), value)
            line += ','
            self.class_output += [indent(line)]
            count += 1

    def _add_constructor(self):
        pass

    def _add_load_from_binary_custom(self, load_from_binary_method):
        pass

    def _add_serialize_custom(self, serialize_method):
        pass

    def add_enum_value(self, name, value, comments):
        self.enum_values[create_enum_name(name)] = [value, comments]

    def _add_public_declarations(self):
        pass

    def _add_private_declarations(self):
        pass

    def _calculate_size(self, new_getter):
        pass

    def generate(self):
        self._add_class_definition()
        self._write_enum_values()
        self.class_output += ['}']
        return self.class_output
