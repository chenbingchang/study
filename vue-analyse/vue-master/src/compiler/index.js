/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 1、模板解析阶段：用正则等方式解析 template 模板中的指令、class、style等数据，形成AST
  const ast = parse(template.trim(), options)
  // 2、优化阶段：遍历AST，找出其中的静态节点，并打上标记；
  optimize(ast, options)
  // 3、代码生成阶段：将AST转换成渲染函数；
  const code = generate(ast, options)
  return {
    ast, // AST树
    render: code.render, // render函数的字符串
    staticRenderFns: code.staticRenderFns // 静态节点渲染函数字符串数组
  }
})
