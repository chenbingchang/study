/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

/**
 * 阻断变异方法并且触发事件
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method 保存原来的数组方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 调用原方法，确保数组会进行原来的操作
    const result = original.apply(this, args)
    // Observe实例
    const ob = this.__ob__
    // 如果有新增元素，需要转换成响应式
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        // splice方法，从下标第二个开始是新增元素
        inserted = args.slice(2)
        break
    }
    // 如果有新增，把新增的元素进行监听
    if (inserted) ob.observeArray(inserted)
    // notify change 通知更改
    ob.dep.notify()
    // 返回原方法的结果
    return result
  })
})
