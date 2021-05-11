/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 标记是否转换成响应式的
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
export const observerState = {
  shouldConvert: true
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    /* 
    这个dep是留给数组类型的，因为数组无法设置getter/setter，所以需要覆盖数组的变异方法，
    当调用数组的变异方法时，通过这里的dep来通知观察者更新
    */
    this.dep = new Dep() // 依赖收集
    this.vmCount = 0 // 组件数量
    def(value, '__ob__', this) // 添加"__ob__"属性
    if (Array.isArray(value)) {
      // 数组
      const augment = hasProto
        ? protoAugment
        : copyAugment
      // 1.数组的话重写数组原型方法 
      augment(value, arrayMethods, arrayKeys)
      // 2.观测数组中是对象类型的数据
      this.observeArray(value)
    } else {
      // 3.对象的话使用defineProperty重新定义属性
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 遍历属性，分别定义响应式
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.  监听数组每一项
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src // 有__proto__就通过__proto__，没有就通过copyAugment直接在对象上添加属性
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 * 尝试为value创建一个Observer实例，如果创建成功，直接返回新创建的Observer实例。
 * 如果 Value 已经存在一个Observer实例，则直接返回它
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 不是对象、或者是VNode实例，直接返回
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 判断是否已经被监听过
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__ // __ob__是Observer的一个指向实例本身的属性
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() && // 不是服务端渲染
    (Array.isArray(value) || isPlainObject(value)) && // 是数组或者对象
    Object.isExtensible(value) && // 可拓展
    !value._isVue // 不是vue组件
  ) {
    ob = new Observer(value) // 新建Observer
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 * 把对象的属性定义成响应式
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 对象属性的依赖类
  // 对象键的描述
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {// 对象不可配置，无法重新定义存取器，直接返回
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get// 保存原有的存取器
  const setter = property && property.set// 保存原有的存取器

  let childOb = !shallow && observe(val) // 检查值是否也是可以监听的类型
  // 3.重新定义set和get方法
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 获取值
      const value = getter ? getter.call(obj) : val
      // 如果有watcher在收集依赖项
      if (Dep.target) {
        dep.depend() // 收集依赖
        // 如果值也是响应式，也进行收集依赖
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            // 值是数组，数组所有元素都收集依赖
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 获取值
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        // 新值和旧值相等，直接返回
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) { // 原来的setter
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal) // 如果设置值是对象
      dep.notify() // 通知观察者
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 数组，直接换成调用重写的splice方法即可
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  // 对象，如果是本来就存在的属性直接设置值
  if (hasOwn(target, key)) {
    target[key] = val
    return val
  }

  const ob = (target: any).__ob__
  // 不能在Vue实例上设置，__ob__是Vue实例上的一个属性指向Vue实例本身
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }

  // 5.如果不是响应式的也不需要将其定义成响应式属性
  if (!ob) {
    target[key] = val
    return val
  }

  // 6.将属性定义成响应式的(疑问：不知什么情况下才会轮着这里？)
  defineReactive(ob.value, key, val)
  ob.dep.notify()// 7.通知视图更新
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  // 1.如果是数组依旧调用splice方法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }

  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  // 2.如果本身就没有这个属性什么都不做
  if (!hasOwn(target, key)) {
    return
  }
  // 3.删除这个属性
  delete target[key]
  if (!ob) {
    return
  }
  // 4.通知更新，到了这里ob要存在，并且target不是数组，对象存在这个key属性，(target._isVue || (ob && ob.vmCount))不成立
  ob.dep.notify()
}

/**
 * 递归数组所有项收集依赖
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value: Array<any>) {
  // 遍历所有元素
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend() // 如果元素是响应式则收集依赖
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
