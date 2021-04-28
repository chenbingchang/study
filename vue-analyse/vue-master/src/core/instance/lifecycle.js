/* @flow */

import config from '../config'
import Watcher from '../observer/watcher'
import { mark, measure } from '../util/perf'
import { createEmptyVNode } from '../vdom/vnode'
import { observerState } from '../observer/index'
import { updateComponentListeners } from './events'
import { resolveSlots } from './render-helpers/resolve-slots'

import {
  warn,
  noop,
  remove,
  handleError,
  emptyObject,
  validateProp
} from '../util/index'

export let activeInstance: any = null
export let isUpdatingChildComponent: boolean = false

// 初始化生命周期
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  // abstract是个隐藏属性，表示是否是抽象组件（比如: keep-alive/transtion）
  if (parent && !options.abstract) {
    // 找到父级是非抽象的父级
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  // '$'开头都是实例的属性，而'_'开头的都是内容的属性
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false // 挂载标记
  vm._isDestroyed = false // 销毁标记
  vm._isBeingDestroyed = false // 销毁中标记
}

// 全局生命周期混入
export function lifecycleMixin (Vue: Class<Component>) {
  // _update是更新视图，渲染虚拟dom
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode // 当前的vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render   初始渲染
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null
    } else {
      // updates    更新
      vm.$el = vm.__patch__(prevVnode, vnode) // __patch__就是diff算法，比较前、后两个虚拟dom的差异然后更新dom
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

  Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }

  Vue.prototype.$destroy = function () {
    const vm: Component = this
    // 销毁中，直接返回
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy') // 调用生命周期钩子
    vm._isBeingDestroyed = true // 标记销毁中
    // 从父级中删除自己
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // 卸载watcher
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown() // 将实例自身（渲染视图）从其他数据的依赖列表中删除
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown() // 移除实例内数据对其他数据的依赖，如computed/watch
    }
    // 移除实例内响应式数据的引用
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // 标记已经销毁
    // call the last hook...
    vm._isDestroyed = true
    // patch删除所有dom
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // 触发该组件destroyed钩子
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // 移除所有事件监听
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}

// 挂载组件
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    // 没有render函数，则赋值空的渲染函数
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount') // 生命周期beforeMount

  let updateComponent // 更新组件视图的方法
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name // 组件name
      const id = vm._uid // 组件id
      const startTag = `vue-perf-start:${id}` // 性能测试的开始标记
      const endTag = `vue-perf-end:${id}` // 性能测试的结束标记

      mark(startTag) // 标记开始标记
      const vnode = vm._render() // 执行渲染函数，得到虚拟dom即vnode
      mark(endTag) // 标记结束标记
      measure(`vue ${name} render`, startTag, endTag) // 保存渲染函数的性能

      mark(startTag)
      vm._update(vnode, hydrating) // 更新视图，用vnode去path，来更新视图
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  /* 
  创建组件的Watcher，在data数据改变时通过关联的Dep调用Watcher更新视图
  vm._watcher  是组件视图依赖数据的watcher
  vm._watchers 是组件computed和watch依赖别的数据的watcher数组
  */
  vm._watcher = new Watcher(vm, updateComponent, noop)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true // 渲染完成标识
    callHook(vm, 'mounted') // 生命周期mounted
  }
  return vm
}

export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: VNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  const hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  )

  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  vm.$options._renderChildren = renderChildren

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject
  vm.$listeners = listeners || emptyObject

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      props[key] = validateProp(key, vm.$options.props, propsData, vm)
    }
    observerState.shouldConvert = true
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  // update listeners
  if (listeners) {
    const oldListeners = vm.$options._parentListeners
    vm.$options._parentListeners = listeners
    updateComponentListeners(vm, listeners, oldListeners)
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) return true
  }
  return false
}

export function activateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}

export function deactivateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}

// 触发生命周期钩子
export function callHook (vm: Component, hook: string) {
  const handlers = vm.$options[hook] // 对应生命周期的函数列表
  if (handlers) {
    // 遍历执行相应的函数
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
}
