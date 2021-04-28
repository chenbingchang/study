/* @flow */

import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError
} from '../util/index'

import type { ISet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component; // 关联的组件
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: ISet;
  newDepIds: ISet;
  getter: Function; // 更新组件视图的方法，一般是updateComponent方法，在(instance/lifecycle.js)
  value: any;

  constructor (
    vm: Component, // 组件实例
    expOrFn: string | Function, // 响应时要执行的方法
    cb: Function, // 回调函数
    options?: Object // 配置
  ) {
    this.vm = vm // 组件的引用
    /* 
    一个vm可以有多个Watcher，
    vm._watchers 是组件computed和watch依赖别的数据的watcher数组
    比如：1、computed属性，依赖prop/data等;2、watch依赖数据的改变，然后重新执行方法
    */
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep // watch的配置项deep
      this.user = !!options.user // 是否用户添加
      this.lazy = !!options.lazy // computed都是lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true // 是否是活的，如果已经被销毁，则无法使用该watcher
    this.dirty = this.lazy // for lazy watchers
    this.deps = [] // 依赖数组
    this.newDeps = []
    this.depIds = new Set() // dep的id数组
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn // 
    } else {
      // 解析路劲变成函数，给watch配置项用，比如'form.name'
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   * 对getter进行依赖收集
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm) // 更新视图，在更新视图中会调用绑定的data数据，通过data的属性劫持从而收集依赖
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * 添加依赖
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep) // 当前Watcher收集Dep
      if (!this.depIds.has(id)) {
        dep.addSub(this) // Dep收集Watcher
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      // 懒加载，标记是脏数据
      this.dirty = true
    } else if (this.sync) {
      // 同步，马上执行
      this.run()
    } else {
      // 放到队列中，等到下一个事件轮询再执行，避免同一时间段内执行多次
      queueWatcher(this)
    }
  }

  /**
   * 执行watcher真正要运行的函数
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value // 保存旧值
        this.value = value // 新值
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * 获取该watcher的值，只供懒加载的watcher使用，比如：computed选项
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    // 更新数据
    this.value = this.get()
    this.dirty = false
  }

  /**
   * 把当前watcher的所有依赖，再进行一次收集watcher
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * 从所有的依赖中，移除自己
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        // 组件不是销毁中
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
const seenObjects = new Set()
function traverse (val: any) {
  seenObjects.clear()
  _traverse(val, seenObjects)
}

function _traverse (val: any, seen: ISet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
