/* @flow */

import { cached } from 'shared/util'
import { parseFilters } from './filter-parser'

// 默认的文本变量匹配表达式
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

// 构建变量的正则表达式
const buildRegex = cached(delimiters => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&')
  const close = delimiters[1].replace(regexEscapeRE, '\\$&')
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})

export function parseText (
  text: string,
  delimiters?: [string, string]
): string | void {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  // 如果文本没有变量直接返回
  if (!tagRE.test(text)) {
    return
  }

  // 存放普通文本和变量
  const tokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index
  // 循环匹配文本中的变量
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      // 先把'{{'前面的文本放入tokens中
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    // tag token
    // 取出'{{ }}'中间的变量exp
    const exp = parseFilters(match[1].trim())
    // 把变量exp改成_s(exp)形式也放入tokens中
    tokens.push(`_s(${exp})`)
    // 设置lastIndex 以保证下一轮循环时，只从'}}'后面再开始匹配正则
    lastIndex = index + match[0].length
  }
  // 当剩下的text不再被正则匹配上时，表示所有变量已经处理完毕
  // 此时如果lastIndex < text.length，表示在最后一个变量后面还有文本
  // 最后将后面的文本再加入到tokens中
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
  // 最后把数组tokens中的所有元素用'+'拼接起来
  return tokens.join('+')
}
