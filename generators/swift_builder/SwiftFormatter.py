
from collections import namedtuple

Argument = namedtuple('Argument', ('type_name', 'name'))


class SwiftFormatter:
    def __init__(self):
        self._indent_level = 0
        self._output = []

    def get_generated(self):
        return self._output

    def begin_class_definition(self,
                               class_name,
                               modifier='public',
                               parents=None,
                               is_enum=False,
                               comments=''
                               ):

        self._add_line('// {}'.format(comments))

        self._add_line(
            '{MODIFIER} {CLASS} {CLASS_NAME}{PARENTS} {{'.format(
                MODIFIER=modifier,
                CLASS='class' if not is_enum else 'enum',
                CLASS_NAME=class_name,
                PARENTS='' if parents is None else (': ' + ', '.join(parents))
            )
        )
        self._increment_indent()

    def end_class_definition(self):
        self._decrement_indent()
        self._add_line('}')

    def add_method_definition(self,
                              method_name,
                              arguments,
                              method_body,
                              return_type='',
                              modifier='public',
                              throws=False,
                              comments=''):

        self._add_line('// {}'.format(comments))

        arguments_line = ','.join(
            map(lambda argument: '{NAME}: {TYPE}'.format(NAME=argument.name, TYPE=argument.type_name),arguments))

        self._add_line(
            '{MODIFIER} func {METHOD_NAME}({ARGUMENTS}) {THROWS} {RETURN_TYPE} {{'.format(
                MODIFIER=modifier,
                ARGUMENTS=arguments_line,
                METHOD_NAME=method_name,
                THROWS='throws' if throws else '',
                RETURN_TYPE=('-> ' + return_type) if len(return_type) > 0 else ''
            )
        )

        self._increment_indent()

        for body_line in method_body:
            self._add_line(body_line)

        self._decrement_indent()
        self._add_line('}')

    def add_initializer(self,
                        arguments,
                        method_body,
                        modifier='public',
                        throws=False,
                        comments=''):

        self._add_line('// {}'.format(comments))

        arguments_line = ', '.join(
            map(lambda argument: '{NAME}: {TYPE}'.format(NAME=argument.name, TYPE=argument.type_name),arguments))

        self._add_line(
            '{MODIFIER} init({ARGUMENTS}) {THROWS} {{'.format(
                MODIFIER=modifier,
                ARGUMENTS=arguments_line,
                THROWS='throws' if throws else ''
            )
        )

        self._increment_indent()

        for body_line in method_body:
            self._add_line(body_line)

        self._decrement_indent()
        self._add_line('}')

    def add_setter(self,
                   type_name,
                   name,
                   comments=''
                   ):

        self._add_line('// {}'.format(comments))

        self.add_method_definition(
            method_name='set{NAME}'.format(NAME=name.capitalize()),
            arguments=[Argument(type_name, name)],
            method_body=['self.{NAME} = {NAME}'.format(NAME=name)]
        )

    def add_property(self,
                     type_name,
                     name,
                     modifier='public',
                     is_mutable=False,
                     comments=''
                     ):
        self._add_line('// {}'.format(comments))

        self._add_line(
            '{MODIFIER} {DEC} {NAME}: {TYPE_NAME}'.format(
                MODIFIER=modifier,
                DEC='let' if not is_mutable else 'var',
                NAME=name,
                TYPE_NAME=type_name
            )
        )

    def add_computed_property(self,
                              type_name,
                              name,
                              method_body,
                              modifier='public',
                              comments=''
                              ):
        self._add_line('// {}'.format(comments))

        self._add_line(
            '{MODIFIER} var {NAME}: {TYPE_NAME} {{'.format(
                MODIFIER=modifier,
                NAME=name,
                TYPE_NAME=type_name
            )
        )
        self._increment_indent()
        for body_line in method_body:
            self._add_line(body_line)

        self._decrement_indent()
        self._add_line('}')

    def add_enum_value(self,
                       name,
                       value,
                       comments=''
                       ):

        self._add_line('case {NAME} = {VALUE} // {COMMENTS}'.format(
            NAME=name,
            VALUE=value,
            COMMENTS=comments
        ))

    def add_typealias(self,
                      type_name,
                      aliased_type_name,
                      modifier='public'):
        self._add_line('{MODIFIER} typealias {TYPE_NAME} = {ALIASED_TYPE_NAME}'.format(
            MODIFIER=modifier,
            TYPE_NAME=type_name,
            ALIASED_TYPE_NAME=aliased_type_name
        ))

    def add_constant(self,
                     type_name,
                     name,
                     value,
                     modifier='public',
                     comments=''):

        self._add_line('{MODIFIER} static let {NAME}: {TYPE_NAME} = {VALUE} // {COMMENTS}'.format(
            MODIFIER=modifier,
            NAME=name,
            TYPE_NAME=type_name,
            VALUE=value,
            COMMENTS=comments
        ))

    def _add_line(self, line):
        self._output.append(self._get_indent() + line)

    def _get_indent(self):
        return ' ' * self._indent_level * 4

    def _increment_indent(self):
        self._indent_level += 1

    def _decrement_indent(self):
        self._indent_level -= 1
