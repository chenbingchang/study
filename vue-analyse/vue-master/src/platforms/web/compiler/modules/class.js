/* @flow */

import { parseText } from 'compiler/parser/text-parser'
import {
  getAndRemoveAttr,
  getBindingAttr,
  baseWarn
} from 'compiler/helpers'

// 转换AST节点，把类名相关的属性，从attrsList中加到AST指定属性上
function transformNode (el: ASTElement, options: CompilerOptions) {
  const warn = options.warn || baseWarn // 警告
  // 获取静态类名
  const staticClass = getAndRemoveAttr(el, 'class')
  // 警告
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    const expression = parseText(staticClass, options.delimiters)
    if (expression) {
      warn(
        `class="${staticClass}": ` +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      )
    }
  }
  if (staticClass) {
    // 保存静态类名
    el.staticClass = JSON.stringify(staticClass)
  }
  // 获取绑定类名
  const classBinding = getBindingAttr(el, 'class', false /* getStatic */)
  if (classBinding) {
    // 保存绑定类名
    el.classBinding = classBinding
  }
}

// 获取AST中类名相关的数据，并拼接成指定格式的字符串
function genData (el: ASTElement): string {
  let data = ''
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`
  }
  return data
}

export default {
  staticKeys: ['staticClass'],
  transformNode,
  genData
}
