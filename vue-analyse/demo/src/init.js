import {initState} from './state';
import {compileToFunctions} from './compile/index';

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this

    vm.$options = options
    // 初始化状态
    initState(vm)
    // 页面挂载
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options

    el = document.querySelector(el)
    // 如果没有render方法
    if(!options.render) {
      let template = options.template

      // 如果没有模板但是有el
      if(!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)// 将template编译成render函数
      options.render = render
    }
  }
}