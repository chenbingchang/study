/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * 查询元素，如果是元素之间返回
 * Query an element selector if it's not an element already.
 */
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    // 字符串，直接查询
    const selected = document.querySelector(el)
    if (!selected) {
      // 查询后不存在，直接返回一个div元素
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    return selected
  } else {
    // 元素类型，直接返回
    return el
  }
}
