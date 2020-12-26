import {observe} from './observer/index';

export function initState(vm) {
  const opts = vm.$options

  if(opts.props) {
    initProps(vm)
  }
  if(opts.methods) {
    initMethods(vm)
  }
  if(opts.data) {
    initData(vm)
  }
  if(opts.computed) {
    initComputed(vm)
  }
  if(opts.watch) {
    initWatch(vm)
  }
}

function initProps(vm) {}

function initMethods(vm) {}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data

  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  for(let key in data) {// 将_data上的属性全部代理给vm实例
    proxy(vm, '_data', key)
  }
  observe(data)
}

function initComputed(vm) {}

function initWatch(vm) {}
