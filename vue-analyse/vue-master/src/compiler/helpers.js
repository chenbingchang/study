/* @flow */

import { parseFilters } from './parser/filter-parser'

// 基本警告
export function baseWarn (msg: string) {
  console.error(`[Vue compiler]: ${msg}`)
}

// 采摘模块方法
export function pluckModuleFunction<F: Function> (
  modules: ?Array<Object>,
  key: string
): Array<F> {
  return modules
    ? modules.map(m => m[key]).filter(_ => _)
    : []
}

// 添加prop
export function addProp (el: ASTElement, name: string, value: string) {
  (el.props || (el.props = [])).push({ name, value })
}

// 添加属性
export function addAttr (el: ASTElement, name: string, value: string) {
  (el.attrs || (el.attrs = [])).push({ name, value })
}

// 添加指令
export function addDirective (
  el: ASTElement, // AST
  name: string, // 属性名，如slot
  rawName: string, // 解析时完整的属性名，如v-slot
  value: string, // 属性值
  arg: ?string, // 指令的参数
  modifiers: ?ASTModifiers // 指令的修饰符
) {
  (el.directives || (el.directives = [])).push({ name, rawName, value, arg, modifiers })
}

// 添加事件(v-on)
export function addHandler (
  el: ASTElement, // AST
  name: string, // 事件名称
  value: string, // 处理函数
  modifiers: ?ASTModifiers, // 修饰符
  important?: boolean, // 重要性，多个相同事件的调用顺序
  warn?: Function
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    )
  }
  // check capture modifier   捕获修饰符
  if (modifiers && modifiers.capture) {
    delete modifiers.capture
    name = '!' + name // mark the event as captured   给事件名前加'!'用以标记capture修饰符
  }
  // 一次性修饰符
  if (modifiers && modifiers.once) {
    delete modifiers.once
    name = '~' + name // mark the event as once   给事件名前加'~'用以标记once修饰符
  }
  // passive修饰符
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive
    name = '&' + name // mark the event as passive    给事件名前加'&'用以标记passive修饰符
  }
  let events
  // 判断是否是原生事件，原生事件和非原生事件分开存放
  if (modifiers && modifiers.native) {
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {}) // 原生事件
  } else {
    events = el.events || (el.events = {}) // 非原生事件
  }
  // 新的处理对象
  const newHandler = { value, modifiers }
  // 原本的处理对象
  const handlers = events[name]
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    // 数组，则根据重要性来放到头部或者尾部
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } else if (handlers) {
    // 不是数组，则改成数组
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } else {
    // 原来没有该事件，直接赋值
    events[name] = newHandler
  }
}

// 获取绑定属性
export function getBindingAttr (
  el: ASTElement,
  name: string,
  getStatic?: boolean
): ?string {
  // 绑定属性比静态多了':'或者'v-bind:'
  const dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name)
  if (dynamicValue != null) {
    // 解析过滤器
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    // 没有绑定属性，并且没有指定必须获取静态属性，则默认获取静态属性
    const staticValue = getAndRemoveAttr(el, name)
    if (staticValue != null) {
      // 从非绑定属性取的值要序列化，保证后面用的时候是一致的
      return JSON.stringify(staticValue)
    }
  }
}

// 获取属性，并且从attrsList中删除
// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
export function getAndRemoveAttr (
  el: ASTElement,
  name: string,
  removeFromMap?: boolean
): ?string {
  let val
  if ((val = el.attrsMap[name]) != null) {
    // 有该属性
    const list = el.attrsList
    // 遍历attrsList，找到并且删除
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  // 如果要从attrsMap中删除，则删除
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  return val
}
