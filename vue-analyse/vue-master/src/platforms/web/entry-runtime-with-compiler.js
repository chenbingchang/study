/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index' //    1.引入运行时代码
import { query } from './util/index'
import { shouldDecodeNewlines } from './util/compat'
import { compileToFunctions } from './compiler/index'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount //  2.获取runtime中的$mount方法
// 重写$mount方法，增加把template变成render方法的代码
Vue.prototype.$mount = function ( // 3. 重写$mount方法
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 查询元素
  el = el && query(el)

  // 不能是body或者html
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) { // 4.没有render方法就进行编译操作
    let template = options.template
    if (template) {  // 5.将模板编译成函数
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') { // 模板是#开头，表示是一个id选择器
          template = idToTemplate(template) // 通过id查到对应的元素的模板
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) { // template本身就是节点
        template = template.innerHTML
      } else { // 错误警告
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 没有模板，取元素的outerHTML当模板
      template = getOuterHTML(el)
    }

    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 编译模板
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        delimiters: options.delimiters, // 变量的嵌套字符
        comments: options.comments
      }, this)
      options.render = render // 6.将render函数放到options中
      options.staticRenderFns = staticRenderFns // 静态节点渲染函数

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }

  return mount.call(this, el, hydrating) // 7、调用回原来的mount方法，进行挂载操作
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions // 编译方法

export default Vue
