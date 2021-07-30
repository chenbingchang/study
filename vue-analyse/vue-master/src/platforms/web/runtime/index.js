/* @flow */

import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser, isChrome } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils    安装平台特殊的工具
Vue.config.mustUseProp = mustUseProp // Vue.config的全局配置，在创建Vue之前修改
Vue.config.isReservedTag = isReservedTag // 保留标签
Vue.config.isReservedAttr = isReservedAttr // 保留属性
Vue.config.getTagNamespace = getTagNamespace // 标签命名空间
Vue.config.isUnknownElement = isUnknownElement // 未知元素

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives) // 添加平台的指令，model/show
extend(Vue.options.components, platformComponents) // 添加平台的组件, transition/transitionGroup

// install platform patch function    安装平台path函数
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method  公共的$mount方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
Vue.nextTick(() => {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue)
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      )
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      `You are running Vue in development mode.\n` +
      `Make sure to turn on production mode when deploying for production.\n` +
      `See more tips at https://vuejs.org/guide/deployment.html`
    )
  }
}, 0)

export default Vue
