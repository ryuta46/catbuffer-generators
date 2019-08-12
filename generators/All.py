from generators.cpp_builder.BuilderGenerator import BuilderGenerator
from generators.java.JavaFileGenerator import JavaFileGenerator
from generators.swift_builder.SwiftGenerator import SwiftGenerator

AVAILABLE_GENERATORS = {
    'cpp_builder': BuilderGenerator,
    'java': JavaFileGenerator,
    'swift_builder': SwiftGenerator
}
