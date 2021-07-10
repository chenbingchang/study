/* @flow */

/**
 * Cross-platform code generation for component v-model
 */
export function genComponentModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const { number, trim } = modifiers || {}

  const baseValueExpression = '$$v'
  let valueExpression = baseValueExpression
  if (trim) {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
        `? ${baseValueExpression}.trim()` +
        `: ${baseValueExpression})`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }
  const assignment = genAssignmentCode(value, valueExpression)

  el.model = {
    value: `(${value})`,
    expression: `"${value}"`,
    callback: `function (${baseValueExpression}) {${assignment}}`
  }
}

/**
 * 用于生成v-model值生成代码的跨平台codegen帮助程序。
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
export function genAssignmentCode (
  value: string,
  assignment: string
): string {
  // 解析model，得到基础路劲和最后一个key
  const res = parseModel(value)
  if (res.key === null) {
    // 没有最后的key，value和基础路劲相等。直接把值赋给value
    return `${value}=${assignment}`
  } else {
    /*
      如果有基础路劲，则需要触发数据响应。
      这里为啥不直接   "value = assignment" 呢？
      因为如果基础路劲对应的类型如果是数组，那么 "obj[xxx][0] = assignment"
      无法触发响应式，这里只能借用vue的全局$set方法来保证100%的响应式
    */
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

let len, str, chr, index, expressionPos, expressionEndPos

type ModelParseResult = {
  exp: string,
  key: string | null
}

/*
  解析model表达式到基础路劲和最后一个key
  处理方括号和点路劲
 */
export function parseModel (val: string): ModelParseResult {
  len = val.length

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    /*
      没有方括号访问符，或者最后一个字符不是']'
      比如：test  test.name  test[key].name
     */
    index = val.lastIndexOf('.') // 最后一个.的下标
    if (index > -1) {
      // 有.访问符
      return {
        exp: val.slice(0, index), // 前面的基础路劲
        key: '"' + val.slice(index + 1) + '"' // 最后的一段key
      }
    } else {
      // 没有.访问符
      return {
        exp: val,
        key: null // 没有方括号访问符也没有.访问符，则为null
      }
    }
  }

  /*
    有方括号访问符并且最后一个字符是']'
    比如：test[0] test['gg']  test[age] test[list[0].name]  text[info][price]
    需要找到最后一个对方括号的下标来提取最后的key
  */
  str = val
  index = expressionPos = expressionEndPos = 0 // 初始化下标

  // 判断是否解析完成，如果没有完成则继续循环,查找最后一对方括号下标
  while (!eof()) {
    chr = next() // 获取下一个码点
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      // 字符串的开始
      // 解析字符串，直到字符串结束
      parseString(chr)
    } else if (chr === 0x5B) { // 0x5B [  方括号访问符开始
      // 解析方括号，直到方括号闭合，并且记录开始、结束下标
      parseBracket(chr)
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

// 获取下一个charCode
function next (): number {
  return str.charCodeAt(++index)
}

// 判断是否解析完成
function eof (): boolean {
  return index >= len
}

// 是否是字符串的开始
function isStringStart (chr: number): boolean {
  // 0x22 "     0x22 '
  return chr === 0x22 || chr === 0x22
}

// 解析方括号，直到方括号闭合，并且记录开始、结束下标
function parseBracket (chr: number): void {
  let inBracket = 1 // 方括号的数据，遇到'['就+1，遇到']'就-1，为0则闭合。一开始匹配了一个'['所以是1开始
  // 记录方括号开始、结束的下标。保存key的时候用
  expressionPos = index
  // 判断是否解析完成，如果没有完成则继续循环
  while (!eof()) {
    chr = next()
    // 如果是字符串开始，则解析字符串，直到字符串结束
    if (isStringStart(chr)) {
      parseString(chr)
      continue
    }
    if (chr === 0x5B) inBracket++ // [
    if (chr === 0x5D) inBracket-- // ]
    if (inBracket === 0) { // 闭合
      expressionEndPos = index
      break
    }
  }
}

// 解析字符串，直到字符串结束
function parseString (chr: number): void {
  const stringQuote = chr // 字符串的引号，包括双引号、单引号
  // 判断是否解析完成，如果没有完成则继续循环
  while (!eof()) {
    chr = next()
    // 如果和开始的字符串引号相等，则结束
    if (chr === stringQuote) {
      break
    }
  }
}
