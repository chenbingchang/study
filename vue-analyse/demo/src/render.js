import {createTextNode, createElement} from './vdom/create-element';

export function renderMixin(Vue) {
  Vue.prototype._v = function(text) { // 创建文本
    return createTextNode(text)
  }

  Vue.prototype._c = function() { // 创建元素
    return createElement(...arguments)
  }

  Vue.prototype._s = function(val) { // 绑定的变量
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }

  Vue.prototype._render = function() {
    const vm = this
    const {render} = vm.$options
    let vnode = render.call(vm)

    return vnode
  }
}