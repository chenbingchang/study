/* @flow */

import { warn } from './debug'
import { observe, observerState } from '../observer/index'
import {
  hasOwn,
  isObject,
  toRawType,
  hyphenate,
  capitalize,
  isPlainObject
} from 'shared/util'

type PropOptions = {
  type: Function | Array<Function> | null,
  default: any,
  required: ?boolean,
  validator: ?Function
};

// 校验prop的值，并返回最终的值
export function validateProp (
  key: string,
  propOptions: Object,
  propsData: Object,
  vm?: Component
): any {
  // key对应的配置信息
  const prop = propOptions[key]
  // 是否缺省（父级是否有给该prop传值）
  const absent = !hasOwn(propsData, key)
  // 父级传给该prop的值
  let value = propsData[key]
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    // Boolean类型
    if (absent && !hasOwn(prop, 'default')) {
      // 父级没传该prop，并且没有配置默认值，则默认false
      value = false
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      // 值是空字符串、或者值和key的连接符命名方式一样，则默认true
      value = true
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldConvert = observerState.shouldConvert
    observerState.shouldConvert = true
    // 进行响应式监听
    observe(value)
    observerState.shouldConvert = prevShouldConvert
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent)
  }
  return value
}

/**
 * 获取prop的默认值
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm: ?Component, prop: PropOptions, key: string): any {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    // 没有默认值，返回undefined
    return undefined
  }
  const def = prop.default
  // 默认值只能是基本类型，和方法
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    )
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * 判断prop是否是有效的
 * Assert whether a prop is valid.
 */
function assertProp (
  prop: PropOptions,
  name: string,
  value: any,
  vm: ?Component,
  absent: boolean
) {
  // 属性必填，而当前是缺省的，则警告
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    )
    return
  }
  // 非必填，并且父级没有传值，直接返回
  if (value == null && !prop.required) {
    return
  }
  let type = prop.type
  // 如果用户设置的是原生构造函数或数组，那么此时vaild默认为false（!type），如果用户没有设置该属性，表示不需要校验，那么此时vaild默认为true，即校验成功
  let valid = !type || type === true
  // 预期的类型
  const expectedTypes = []
  if (type) {
    // 存在type设置
    if (!Array.isArray(type)) {
      // 统一转为数组
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const assertedType = assertType(value, type[i])
      expectedTypes.push(assertedType.expectedType || '')
      valid = assertedType.valid
    }
  }
  if (!valid) {
    // 校验失败，警告
    warn(
      `Invalid prop: type check failed for prop "${name}".` +
      ` Expected ${expectedTypes.map(capitalize).join(', ')}` +
      `, got ${toRawType(value)}.`,
      vm
    )
    return
  }
  // 自定义的校验器
  const validator = prop.validator
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      )
    }
  }
}

// 简单校验，即用typeof可以判断的类型
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/

// 断言类型
function assertType (value: any, type: Function): {
  valid: boolean;
  expectedType: string;
} {
  // 校验结果
  let valid
  // 预期的类型
  const expectedType = getType(type)
  if (simpleCheckRE.test(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects    基本包装器对象，比如 new String('aa')
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value)
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  // Boolean.toString()  结果: "function Boolean() { [native code] }"
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

// 判断是否是指定的类型
function isType (type, fn) {
  if (!Array.isArray(fn)) {
    // 非数组
    return getType(fn) === getType(type)
  }
  for (let i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}
