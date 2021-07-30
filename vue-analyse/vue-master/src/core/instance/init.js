/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  // 给原型对象添加_init方法
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this // 按照 this._init的调用，并且是用New创建的  vm指向Vue实例
    // a uid
    vm._uid = uid++// 1.每个vue的实例上都有一个唯一的属性_uid

    // 性能检测
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true// 2.表示是Vue的实例
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      // 合并选项
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 代理是为了当访问不存在的属性时给出警告
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm // 指向自己的属性
    initLifecycle(vm) // 初始化一些属性,$parent/$root/$children/$refs等
    initEvents(vm) // 初始化事件
    initRender(vm) // 初始化渲染
    callHook(vm, 'beforeCreate') // 调用生命周期钩子函数
    initInjections(vm) // resolve injections before data/props  初始化injections，由于data/props等可能依赖inject所以需要先于initState初始化
    initState(vm) // 初始化props,methods,data,computed,watch
    initProvide(vm) // resolve provide after data/props   初始化 provide，由于provide可能依赖data/props等，所以要在initState之后初始化
    callHook(vm, 'created') // 调用生命周期钩子函数

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      // $mount方法是在后面（web/runtime/index.js）的时候声明的，但是由于new Vue是在那之后，所以没问题
      // 如果没有进行这个，需要用户手动执行vm.$mount方法才进入下一个生命周期阶段
      vm.$mount(vm.$options.el)
    }
  }
}

// 初始化内部组件
function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent
  opts.propsData = options.propsData
  opts._parentVnode = options._parentVnode
  opts._parentListeners = options._parentListeners
  opts._renderChildren = options._renderChildren
  opts._componentTag = options._componentTag
  opts._parentElm = options._parentElm
  opts._refElm = options._refElm
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

// 解析构造函数选项
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options // 构造函数选项
  if (Ctor.super) { // 如果存在父级，则递归调用
    const superOptions = resolveConstructorOptions(Ctor.super) // 真正的父级选项
    const cachedSuperOptions = Ctor.superOptions // 缓存的父级选项
    if (superOptions !== cachedSuperOptions) { // 两个取的父级选项不一样
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions // 保存新的父级选项
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor) // 需要修改的配置
      // update base extend options   更新基础继承的选项
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions) // modifiedOptions覆盖Ctor.extendOptions
      }
      // 合并继承、父级的选项
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        // 用组件的name属性保存组件映射
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

// 解决修改选项
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options // 最新的选项
  const extended = Ctor.extendOptions // 继承的选项
  const sealed = Ctor.sealedOptions // 内置的选项
  for (const key in latest) {
    // 如果最新和内置的选项不同，以最新的配置为准
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

/*
  以latest配置为准
  如果latest在extended或者在sealed中有相同的配置，则使用latest的配置
*/
function dedupe (latest, extended, sealed) {
  // 如果是数组，则去重。其它类型直接返回latest
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed] // 变成数组
    extended = Array.isArray(extended) ? extended : [extended] // 变成数组
    for (let i = 0; i < latest.length; i++) {
      /*
        如果latest在extended中有相同的配置，则使用latest的配置
        或者sealed中没有sealed的配置，则添加latest的配置
       */
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]) // 使用latest的配置
      }
    }
    return res
  } else {
    return latest
  }
}
