from generators.cpp_builder.BuilderGenerator import BuilderGenerator
from generators.java.JavaFileGenerator import JavaFileGenerator
from generators.javascript.JavaScriptGenerator import JavaScriptGenerator
from generators.typescript.TypescriptFileGenerator import TypescriptFileGenerator
from generators.typescript_js_base.TypeScriptGenerator import TypeScriptGenerator

AVAILABLE_GENERATORS = {
    'cpp_builder': BuilderGenerator,
    'java': JavaFileGenerator,
    'js': JavaScriptGenerator,
    'typescript': TypescriptFileGenerator,
    'typescript_js_base': TypeScriptGenerator,

}
