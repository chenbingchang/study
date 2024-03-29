/* @flow */

export const emptyObject = Object.freeze({})

/**
 * Check if a string starts with $ or _
 * 检查是否义'$'或者'_'开头
 */
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.  定义属性
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * 解析简单的路劲
 * Parse simple path.
 */
const bailRE = /[^\w.$]/ // 不属于属性路劲的正则表达式
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    // 不是属性路劲，直接返回
    return
  }
  const segments = path.split('.') // 分割路劲
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]] // 保存这一级的值，然后不断遍历,直到最后
    }
    return obj
  }
}
