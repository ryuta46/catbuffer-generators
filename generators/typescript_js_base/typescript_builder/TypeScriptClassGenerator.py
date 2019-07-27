from .TypeScriptFunctionGenerator import FunctionType, TypeScriptFunctionGenerator
from .TypeScriptGeneratorUtils import indent


class TypeScriptClassGenerator:
    @staticmethod
    def get_generated_class_name(name):
        return '{}Buffer'.format(name)

    @staticmethod
    def get_generated_getter_name(attribute):
        return 'get{}'.format(attribute.capitalize())

    @staticmethod
    def get_generated_setter_name(attribute):
        return 'set{}'.format(attribute.capitalize())

    def __init__(self, name):
        self.class_name = TypeScriptClassGenerator.get_generated_class_name(name)
        self.class_header = ['export class {} {{'.format(self.class_name)]
        self.functions = []
        self.local_vars = []

    def add_constructor(self, initial_values, params):
        new_constructor = TypeScriptFunctionGenerator(FunctionType.CONSTRUCTOR)
        new_constructor.set_params(params)

        for attribute, value in initial_values.items():
            new_constructor.add_instructions(['this.{} = {}'.format(attribute, value)])

        self.functions.append(new_constructor)

    def _add_getter(self, attribute):
        new_getter = TypeScriptFunctionGenerator()
        new_getter.set_name(TypeScriptClassGenerator.get_generated_getter_name(attribute))
        new_getter.add_instructions(['return this.{0}'.format(attribute)])
        self.add_function(new_getter)

    def _add_setter(self, attribute):
        new_setter = TypeScriptFunctionGenerator()
        new_setter.set_name(TypeScriptClassGenerator.get_generated_setter_name(attribute))
        new_setter.set_params([attribute])
        new_setter.add_instructions(['this.{0} = {0}'.format(attribute)])
        self.add_function(new_setter)

    def add_getter_setter(self, attribute):
        self._add_getter(attribute)
        self._add_setter(attribute)

    def add_function(self, function):
        self.functions.append(function)

    def add_local_var(self, attribute):
        self.local_vars.append(['{0}: any'.format(attribute['name'])])

    def get_instructions(self):
        functions = []
        local_vars = []
        for function in self.functions:
            functions += function.get_instructions()
        for local_var in self.local_vars:
            local_vars += local_var
        return self.class_header + [''] + indent(local_vars) + [''] + indent(functions) + ['}']
