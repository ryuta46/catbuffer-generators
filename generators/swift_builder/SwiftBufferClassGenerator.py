from .SwiftFormatter import Argument, SwiftFormatter
from .SwiftFileGenerator import SwiftFileGenerator


class SwiftBufferClassGenerator(SwiftFileGenerator):
    def __init__(self, schema):
        self._schema = schema
        self._formatter = SwiftFormatter()

    def generate(self):
        buffer_size = self._schema.size
        self._formatter.begin_class_definition(self._schema.class_name, comments=self._schema.comments,
                                               parents=['Serializer', 'Deserializer'])
        self._formatter.add_property('[UInt8]', 'buffer')
        self._formatter.add_initializer(
            [Argument('[UInt8]', 'buffer')],
            [
                'guard buffer.count == {SIZE} else {{'.format(SIZE=buffer_size),
                '    throw NSError(domain: "{NAME} buffer size must be {SIZE}", code: -1, userInfo: nil)'.format(
                    NAME=self._schema.class_name, SIZE=buffer_size),
                '}',
                'self.buffer = buffer'
            ],
            throws=True
        )
        self._formatter.add_initializer(
            [],
            [
                'self.buffer = [UInt8](repeating: 0, count: {SIZE})'.format(SIZE=buffer_size)
            ],
        )
        self._formatter.add_computed_property(
            type_name='Int',
            name='size',
            method_body=['return self.buffer.count']
        )

        self._formatter.add_computed_property(
            type_name='Int',
            name='size',
            method_body=['return {SIZE}'.format(SIZE=buffer_size)],
            modifier='public static'
        )

        self._formatter.add_method_definition(
            method_name='serialize',
            arguments=[],
            method_body=['return self.buffer'],
            return_type='[UInt8]'
        )

        self._formatter.add_method_definition(
            method_name='createFrom',
            arguments=[Argument("InputStream", "stream")],
            method_body=[
                "var bytes = [UInt8](repeating: 0, count: size)",
                "guard stream.read(&bytes, maxLength: size) == size else {",
                "    throw NSError(domain: \"Not enough stream data.\", code: -1, userInfo: nil)",
                "}",
                "return unsafeDowncast(try {CLASS_NAME}(buffer: bytes), to: self)".format(
                    CLASS_NAME=self._schema.class_name
                )
            ],
            modifier="public class",
            return_type='Self',
            throws=True
        )

        self._formatter.end_class_definition()

        return self._formatter.get_generated()
