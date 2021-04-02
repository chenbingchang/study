/* @flow */

import { warn } from 'core/util/index'
import { cached, isUndef } from 'shared/util'

// 反向解析修饰符
const normalizeEvent = cached((name: string): {
  name: string,
  once: boolean,
  capture: boolean,
  passive: boolean
} => {
  // 把之前编译模板时给事件修饰符加的特殊符号反向转义
  const passive = name.charAt(0) === '&'
  name = passive ? name.slice(1) : name
  const once = name.charAt(0) === '~' // Prefixed last, checked first
  name = once ? name.slice(1) : name
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name
  // 返回事件名称，各个修饰符
  return {
    name,
    once,
    capture,
    passive
  }
})

// 创建调用函数
export function createFnInvoker (fns: Function | Array<Function>): Function {
  function invoker () {
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      // 数组(一个事件可以有多个处理函数)，则全部执行，但是没有返回值
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments)
      }
    } else {
      // 只有一个处理函数，会有返回值
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  // 把处理函数放到fns属性中
  invoker.fns = fns
  return invoker
}

// 更新监听器
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, cur, old, event
  // 遍历新的监听器
  for (name in on) {
    cur = on[name]
    old = oldOn[name]
    // 解析事件名称的特殊字符
    event = normalizeEvent(name)
    if (isUndef(cur)) {
      // 新事件没有处理方法
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) {
      // 新事件有处理方法，并且没有对应的旧事件，则新增
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      add(event.name, cur, event.once, event.capture, event.passive)
    } else if (cur !== old) {
      // 新旧事件都存在，则用新事件替换旧事件
      old.fns = cur
      on[name] = old
    }
  }
  // 遍历旧的监听器
  for (name in oldOn) {
    // 旧事件存在，而新事件不存在，移除
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
