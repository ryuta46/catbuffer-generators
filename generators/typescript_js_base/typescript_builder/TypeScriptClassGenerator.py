from .TypeScriptFunctionGenerator import FunctionType, TypeScriptFunctionGenerator
from .TypeScriptGeneratorUtils import indent


class TypeScriptClassGenerator:
    @staticmethod
    def get_generated_setter_name(attribute):
        return 'set{}'.format(attribute.capitalize())

    @staticmethod
    def get_generated_getter_name(attribute_val):
        return 'get{}'.format(attribute_val.capitalize())

    @staticmethod
    def get_generated_class_name(class_name):
        return '{}Buffer'.format(class_name)

    def __init__(self, name):
        self.class_name = TypeScriptClassGenerator.get_generated_class_name(name)
        self.class_header = ['export class {} {{'.format(self.class_name)]
        self.local_vars = []
        self.functions = []

    def add_constructor(self, initial_values, params):
        generated_constructor = TypeScriptFunctionGenerator(FunctionType.CONSTRUCTOR)
        generated_constructor.set_params(params)

        for attribute, value in initial_values.items():
            generated_constructor.add_instructions(['this.{} = {}'.format(attribute, value)])

        self.functions.append(generated_constructor)

    def _add_getter(self, attribute):
        generated_getter = TypeScriptFunctionGenerator()
        generated_getter.set_name(TypeScriptClassGenerator.get_generated_getter_name(attribute))
        generated_getter.add_instructions(['return this.{0}'.format(attribute)])
        self.add_function(generated_getter)

    def _add_setter(self, attribute):
        generated_setter = TypeScriptFunctionGenerator()
        generated_setter.set_name(TypeScriptClassGenerator.get_generated_setter_name(attribute))
        generated_setter.set_params([attribute])
        generated_setter.add_instructions(['this.{0} = {0}'.format(attribute)])
        self.add_function(generated_setter)

    def add_getter_setter(self, attribute):
        self._add_setter(attribute)
        self._add_getter(attribute)

    def add_function(self, function_generated):
        self.functions.append(function_generated)

    def add_local_var(self, attribute_value):
        self.local_vars.append(['{0}: any'.format(attribute_value['name'])])

    def get_instructions(self):
        local_variables = []
        functions = []
        for function in self.functions:
            functions += function.get_instructions()
        for var_value in self.local_vars:
            local_variables += var_value
        return self.class_header + [''] + indent(local_variables) + [''] + indent(functions) + ['}']
