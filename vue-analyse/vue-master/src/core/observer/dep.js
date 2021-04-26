/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 添加watcher
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 从当前的watcher列表中移除Watcher
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 收集依赖
  depend () {
    if (Dep.target) {// Dep.target是一个Watcher
      // watcher收集它所依赖的项
      Dep.target.addDep(this)
    }
  }

  // 依赖改变，通知所有依赖该项的wacher进行更新
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = [] // 依赖项当前的作用域，堆数据结构

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
