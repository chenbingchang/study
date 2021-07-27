/* @flow */

import { extend } from 'shared/util'
import { detectErrors } from './error-detector'
import { createCompileToFunctionFn } from './to-function'

/*
创建创建编译器

创建创建编译器，可以动态传入基础编译器
创建编译器，可以动态传入基础编译选项
这里有点柯里化的样子
*/
export function createCompilerCreator (baseCompile: Function): Function {
  // 返回创建编译器
  return function createCompiler (baseOptions: CompilerOptions) {
    // 编译函数
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // 最终的配置
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
      }

      // 合并配置，把用户自定义的和默认的配置进行合并
      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives), // 全局指令
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      // 用基础编译器，编译模板，配置通过合并
      const compiled = baseCompile(template, finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast))
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile, // 编译函数
      compileToFunctions: createCompileToFunctionFn(compile) // 把编译结果变成函数的函数
    }
  }
}
