/* @flow */

import config from '../config'
import { activateChildComponent, callHook } from '../instance/lifecycle'
import {
  devtools, nextTick, warn
} from '../util/index'
import type Watcher from './watcher'


export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = [] // 队列
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {} // 记录已经存在的Watcher的id
let circular: { [key: number]: number } = {} // 记录watcher循环更新的次数
let waiting = false // 是否在等待js线程
let flushing = false // 是否开始清空队列
let index = 0 // 当前执行的队列下标

/**
 * 重置执行器的状态
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0 // 清空数组、下标
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false // 重置标识
}

/**
 * 清空执行队列
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true // 标记开始清空队列
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1、组件从父级到自己的顺序更新。因为父级总数在子级之前创建
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2、组件中computed和watch的watcher创建时间比组件的渲染watcher早
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3、如果一个组件在父组件watcher run的时候销毁，它的watcher会被跳过
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id) // 从小到大排序

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null // 清空对应的watcher记录
    watcher.run()
    // 在开发环境，检查死循环更新
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

// 触发updated钩子
function callUpdatedHooks (queue) {
  let i = queue.length
  // 倒序循环，从而子级的updated钩子先于父级的触发
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    // 判断组件的watcher和当前这个相同，并且已经渲染过
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}

/**
 * 在path期间，把处于activated的kept-alive组件排队
 * 在整个树都已经patched之后处理队列
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent (vm: Component) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false
  activatedChildren.push(vm)
}

// 给所有已经执行过的watcher打上标记，并触发子组件的activated生命周期
function callActivatedHooks (queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true // 标记组件非激活
    // 激活子组件
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * watcher队列，确保同一个watcher只有一个
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 根据id来判断是否已经存在
  if (has[id] == null) {
    // 不存在
    has[id] = true
    if (!flushing) {
      // 没有清空
      // 直接放到队列
      queue.push(watcher)
    } else {
      // 已经开始清空队列，则根据id来插入队列
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      // 当前下标大于当前执行的队列下标，并且要插入的id小于当前下标对应项的id
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      // 插入队列
      queue.splice(i + 1, 0, watcher)
    }
    // 清空队列
    // queue the flush
    if (!waiting) {
      // 当前没有等待立即执行nextTick
      waiting = true
      nextTick(flushSchedulerQueue) // 下一轮询清空队列
    }
  }
}
