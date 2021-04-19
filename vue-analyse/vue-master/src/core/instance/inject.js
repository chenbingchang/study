/* @flow */

import { warn } from '../util/index'
import { hasSymbol } from 'core/util/env'
import { defineReactive, observerState } from '../observer/index'

export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

export function initInjections (vm: Component) {
  // 把inject选项变成键值对
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    // 关闭响应式
    observerState.shouldConvert = false
    // 遍历添加到实例中，注意：是非响应式的，除了值是对象类型之外
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    // 打开响应式
    observerState.shouldConvert = true
  }
}

// 把inject选项变成键值对
export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    // 如果支持Symbol则从可枚举中过滤，否则取所有的key
    const keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(key => {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      // 键，本地的变量名
      const key = keys[i]
      // from配置的是父级provide的变量名
      const provideKey = inject[key].from
      let source = vm
      // 不断向上寻找存在该key的provide
      while (source) {
        if (source._provided && provideKey in source._provided) {
          // 找到，则保存起来
          result[key] = source._provided[provideKey]
          break
        }
        // 找不到，则继续向上寻找
        source = source.$parent
      }
      if (!source) {
        // 在所有父级中都没找到该key对应的provide，则查看inject选项是否有默认值
        if ('default' in inject[key]) {
          // 存在默认值，则使用默认值
          const provideDefault = inject[key].default
          // 引用类型的默认值，必须是方法，所以这里要判断一下
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          // 没有默认值，则警告
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}
