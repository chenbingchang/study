import {pushTarget, popTarget} from './dep';
import {queueWatcher} from '../scheduler';

let id = 0

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.deps = []
    this.depsId = new Set()
    this.vm = vm
    this.exprOrFn = exprOrFn
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.cb = cb
    this.options = options
    this.id = id++
    this.get()
  }

  get() {
    pushTarget(this)
    this.getter()
    popTarget()
  }

  addDep(dep) {
    let id = dep.id

    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  update() {
    queueWatcher(this)
    this.get()
  }
}

export default Watcher