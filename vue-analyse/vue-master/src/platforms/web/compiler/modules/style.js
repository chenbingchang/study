/* @flow */

import { parseText } from 'compiler/parser/text-parser'
import { parseStyleText } from 'web/util/style'
import {
  getAndRemoveAttr,
  getBindingAttr,
  baseWarn
} from 'compiler/helpers'

// 转换AST节点，把样式相关的属性，从attrsList中加到AST指定属性上
function transformNode (el: ASTElement, options: CompilerOptions) {
  const warn = options.warn || baseWarn // 警告
  // 获取静态样式
  const staticStyle = getAndRemoveAttr(el, 'style')
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      const expression = parseText(staticStyle, options.delimiters)
      if (expression) {
        warn(
          `style="${staticStyle}": ` +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        )
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle))
  }

  // 获取绑定样式
  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */)
  if (styleBinding) {
    el.styleBinding = styleBinding
  }
}

// 获取AST中样式相关的数据，并拼接成指定格式的字符串
function genData (el: ASTElement): string {
  let data = ''
  // 获取静态样式
  if (el.staticStyle) {
    data += `staticStyle:${el.staticStyle},`
  }
  // 获取绑定样式
  if (el.styleBinding) {
    data += `style:(${el.styleBinding}),`
  }
  return data
}

export default {
  staticKeys: ['staticStyle'],
  transformNode,
  genData
}
