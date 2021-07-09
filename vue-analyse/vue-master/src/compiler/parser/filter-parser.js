/* @flow */

const validDivisionCharRE = /[\w).+\-_$\]]/

export function parseFilters (exp: string): string {
  let inSingle = false // 单引号
  let inDouble = false // 双引号
  let inTemplateString = false // 模板字符串
  let inRegex = false // 正则表达式
  let curly = 0 // 花括号
  let square = 0 // 方括号
  let paren = 0 // 括号
  let lastFilterIndex = 0 // 最后一个过滤器的下标
  let c, prev, i, expression, filters

  for (i = 0; i < exp.length; i++) {
    prev = c // 前一个的码点
    c = exp.charCodeAt(i) // 码点
    if (inSingle) {
      // 当前字符为'''，并且前面不是转义字符'\'，则关闭单引号
      if (c === 0x27 && prev !== 0x5C) inSingle = false
    } else if (inDouble) {
      // 当前字符为'"'，并且前面不是转义字符'\'，则关闭双引号
      if (c === 0x22 && prev !== 0x5C) inDouble = false
    } else if (inTemplateString) {
      // 当前字符为'`'，并且前面不是转义字符'\'，则关闭模板字符串
      if (c === 0x60 && prev !== 0x5C) inTemplateString = false
    } else if (inRegex) {
      // 当前字符为'/'，并且前面不是转义字符'\'，则关闭正则表达式
      if (c === 0x2f && prev !== 0x5C) inRegex = false
    } else if (
      // 当前是'|'并且前后都不是'|'，并且没有括号，则是过滤函数
      c === 0x7C && // pipe  0x7C是管道符'|'
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // expression为undefined,表明是第一个过滤器
        // first filter, end of expression
        lastFilterIndex = i + 1
        expression = exp.slice(0, i).trim()
      } else {
        pushFilter()
      }
    } else {
      // 判断和表达式相关的特殊字符
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      // 是否是正则表达式
      if (c === 0x2f) { // /
        let j = i - 1
        let p
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j)
          if (p !== ' ') break
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true
        }
      }
    }
  }

  // 到这，如果expression为undefined，则表示没有任何特别的表达式
  if (expression === undefined) {
    expression = exp.slice(0, i).trim()
  } else if (lastFilterIndex !== 0) {
    pushFilter()
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim())
    lastFilterIndex = i + 1
  }

  // 如果有过滤器，则一层层包裹表达式（过滤器可以有多个）
  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i])
    }
  }

  return expression
}

function wrapFilter (exp: string, filter: string): string {
  const i = filter.indexOf('(')
  if (i < 0) {
    // _f: resolveFilter
    return `_f("${filter}")(${exp})`
  } else {
    const name = filter.slice(0, i)
    const args = filter.slice(i + 1)
    return `_f("${name}")(${exp},${args}`
  }
}
