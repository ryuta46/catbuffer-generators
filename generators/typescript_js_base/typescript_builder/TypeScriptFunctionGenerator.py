from enum import Enum

from .TypeScriptGeneratorUtils import indent


class FunctionType(Enum):
    FUNCTION = 0

    ARROW_FUNCTION = 1

    CONSTRUCTOR = 2

    STATIC = 3


class TypeScriptFunctionGenerator:
    def __init__(self, fn_type=FunctionType.FUNCTION):
        self.type = fn_type
        self.name = None
        self.instructions = []
        self.params = []
        self.return_type = ''

    def set_name(self, fun_name):
        self.name = fun_name

    def set_params(self, fun_params):
        self.params = fun_params

    def set_return_type(self, return_type_val):
        self.return_type = return_type_val

    def _get_header(self):
        if self.type is FunctionType.ARROW_FUNCTION:
            return ['{0} = ({1}){2} => {{'
                    .format(self.name, ', '.join(self.params), self.return_type)]
        if self.type is FunctionType.STATIC:
            return ['public static {0}({1}){2} {{'
                    .format(self.name, ', '.join(self.params), self.return_type)]
        if self.type is FunctionType.CONSTRUCTOR:
            return ['constructor({}) {{'
                    .format(', '.join(self.params))]
        return ['{0}({1}){2} {{'
                .format(self.name, ', '.join(self.params), self.return_type)]

    def add_instructions(self, instructions_generated):
        self.instructions += instructions_generated

    def add_block(self, block_generated):
        self.instructions += block_generated.get_instructions()

    def get_instructions(self):
        instructions = self._get_header() + indent(self.instructions) + ['}']
        return instructions
