from enum import Enum

from .TypeScriptGeneratorUtils import indent


class FunctionType(Enum):
    FUNCTION = 0
    ARROW_FUNCTION = 1
    CONSTRUCTOR = 2
    STATIC = 3


class TypeScriptFunctionGenerator:
    def __init__(self, function_type=FunctionType.FUNCTION):
        self.type = function_type
        self.name = None
        self.params = []
        self.instructions = []
        self.return_type = ''

    def set_name(self, name):
        self.name = name

    def set_params(self, params):
        self.params = params

    def set_return_type(self, return_type):
        self.return_type = return_type

    def _get_header(self):
        if self.type is FunctionType.ARROW_FUNCTION:
            return ['{0} = ({1}){2} => {{'.format(self.name, ', '.join(self.params), self.return_type)]
        if self.type is FunctionType.STATIC:
            return ['public static {0}({1}){2} {{'.format(self.name, ', '.join(self.params), self.return_type)]
        if self.type is FunctionType.CONSTRUCTOR:
            return ['constructor({}) {{'.format(', '.join(self.params))]
        return ['{0}({1}){2} {{'.format(self.name, ', '.join(self.params), self.return_type)]

    def add_instructions(self, instructions):
        self.instructions += instructions

    def add_block(self, block):
        self.instructions += block.get_instructions()

    def get_instructions(self):
        return self._get_header() + indent(self.instructions) + ['}']
