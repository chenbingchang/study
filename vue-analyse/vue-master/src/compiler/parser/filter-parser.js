/* @flow */

const validDivisionCharRE = /[\w).+\-_$\]]/

export function parseFilters (exp: string): string {
  let inSingle = false
  let inDouble = false
  let inTemplateString = false
  let inRegex = false
  let curly = 0
  let square = 0
  let paren = 0
  let lastFilterIndex = 0
  let c, prev, i, expression, filters

  /* 排除掉js表达式中的'|'字符，剩下的就是正确的过滤器的标记了
  从头开始遍历传入的exp每一个字符，
  通过判断每一个字符是否是特殊字符（如',",{,},[,],(,),\,|）
  进而判断出exp字符串中哪些部分是表达式，哪些部分是过滤器id
  */
  for (i = 0; i < exp.length; i++) {
    prev = c
    c = exp.charCodeAt(i)
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) inSingle = false
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) inDouble = false
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) inTemplateString = false
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) inRegex = false
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1
        expression = exp.slice(0, i).trim() // expression的结果是: "variable"
      } else {
        // 第二个及以后的过滤器，则先保存前一个的过滤器
        pushFilter()
      }
    } else {
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
      if (c === 0x2f) { // /
        let j = i - 1
        let p
        // 找到前面第一个非空白的字符
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

  // expression为undefined表示没有过滤器
  if (expression === undefined) {
    // 表达式就是整个传进来的exp，比如："variable"
    expression = exp.slice(0, i).trim()
  } else if (lastFilterIndex !== 0) {
    // 有过滤器
    pushFilter()
  }

  // 保存过滤器
  function pushFilter () {
    // 保存过滤器的名称
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim())
    // 改变解析下标
    lastFilterIndex = i + 1
  }

  // 如果过滤器数组存在，遍历过滤表达式
  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i])
    }
  }

  return expression
}

// 用过滤器包裹表达式
function wrapFilter (exp: string, filter: string): string {
  // 判断过滤器是否有别的参数
  const i = filter.indexOf('(')
  /* 
  过滤器可以传别的参数
    {{ message | filterA | filterB }}
    {{ message | filterA('arg1', arg2) }}
  */
  if (i < 0) {
    // 过滤器没有别的参数
    // _f: resolveFilter  获取过滤器资源，拿到过滤器函数，再调用，并且把exp当参数
    return `_f("${filter}")(${exp})`
  } else {
    // 过滤器有别的参数
    const name = filter.slice(0, i) // 过滤器名称
    const args = filter.slice(i + 1) // 别的参数，比如："'arg1', arg2)"
    // exp当第一个参数，后面再接别的参数
    return `_f("${name}")(${exp},${args}`
  }
}
