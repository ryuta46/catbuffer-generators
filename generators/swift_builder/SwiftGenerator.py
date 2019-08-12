import os
import textwrap
from generators.Descriptor import Descriptor

from .SwiftAliasGenerator import SwiftAliasGenerator
from .SwiftBufferClassGenerator import SwiftBufferClassGenerator
from .SwiftEnumClassGenerator import SwiftEnumClassGenerator
from .SwiftStructClassGenerator import SwiftStructClassGenerator
from .Schema import Schema


class SwiftGenerator:
    """Swift file generator"""

    def __init__(self, schema_list, options):
        self._schema_list = schema_list
        self._current = None
        self._options = options

        self._copyright = self._read_copyright(self._options['copyright'])

    def __iter__(self):
        self._current = self._generate()
        return self

    def __next__(self):
        code, name = next(self._current)
        return Descriptor(name + '.swift', code)

    @staticmethod
    def _read_copyright(copyright_file):
        copyright_lines = []
        if os.path.isfile(copyright_file):
            with open(copyright_file) as header:
                copyright_lines = [line.strip() for line in header]

        return copyright_lines

    @staticmethod
    def _get_imports():
        return ['import Foundation']

    def _get_code_header(self):
        code = []
        code.extend(self._copyright)
        code.extend(self._get_imports())
        return code

    def _generate(self):
        code = self._get_code_header()
        code.extend(self._get_serializer_interface())
        yield code, 'Serializer'

        code = self._get_code_header()
        code.extend(self._get_deserializer_interface())
        yield code, 'Deserializer'

        code = self._get_code_header()
        code.extend(self._get_numeric_extension())
        yield code, 'Numeric+Extension'

        code = self._get_code_header()
        code.extend(self._get_array_extension())
        yield code, 'Array+Extension'

        for type_descriptor, value in self._schema_list.items():
            schema = Schema(type_descriptor, value)

            generator = None
            if schema.is_primitive_type:
                generator = SwiftAliasGenerator(schema)
            elif schema.is_byte_type:
                generator = SwiftBufferClassGenerator(schema)
            elif schema.is_enum_type:
                generator = SwiftEnumClassGenerator(schema)

            elif schema.is_struct_type:
                schema.expand_inline_fields(self._schema_list)
                generator = SwiftStructClassGenerator(schema)

            if generator is None:
                continue

            code = self._get_code_header()
            code.extend(generator.generate())
            yield code, schema.class_name

    @staticmethod
    def _get_serializer_interface():
        return textwrap.dedent('''
        protocol Serializer {
            var size: Int {get}
            func serialize() -> [UInt8]
        }
        ''').split('\n')

    @staticmethod
    def _get_deserializer_interface():
        return textwrap.dedent('''
        protocol Deserializer {
            static func createFrom(stream: InputStream) throws -> Self
        }
        ''').split('\n')

    @staticmethod
    def _get_numeric_extension():
        return textwrap.dedent('''
        extension Numeric{
            func serialize() -> [UInt8] {
                var mutableValue = self
                let bytes = Array<UInt8>(withUnsafeBytes(of: &mutableValue) {
                    $0
                })
                return bytes
            }
            
            var size: Int {
                return MemoryLayout<Self>.size
            }

            static func createFrom(stream: InputStream) throws -> Self {
                let size = MemoryLayout<Self>.size
                var bytes = [UInt8](repeating: 0, count: size)

                if stream.read(&bytes, maxLength: size) < size {
                    throw NSError(domain: "Not enough stream data.", code: -1, userInfo: nil)
                }
                let value = UnsafePointer(bytes).withMemoryRebound(to: Self.self, capacity: 1) {
                    $0.pointee
                }
                return value
            }
        }
        extension UInt8: Serializer, Deserializer{}
        extension UInt16: Serializer, Deserializer{}
        extension UInt32: Serializer, Deserializer{}
        extension UInt64: Serializer, Deserializer{}
        ''').split('\n')

    @staticmethod
    def _get_array_extension():
        return textwrap.dedent('''
        import Foundation

        extension Array: Serializer where Element: Serializer{
            func serialize() -> [UInt8] {
                return reduce([]) { $0 + $1.serialize() }
            }
    
            var size: Int {
                return reduce(0) { $0 + $1.size }
            }
        }
        
        extension Array where Element: Deserializer {
            static func createFrom(stream: InputStream, count: Int) throws -> Array<Element> {
                return try (0..<count).map { index in
                    try Element.createFrom(stream: stream)
                }
            }
        }
        ''').split('\n')

