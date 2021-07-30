// import Vue from 'vue'

/**
 * 路由器
 */
class MyVueRouter {
  /**
   * 构造方法
   * @param {Object} options 路由配置
   * @param {string} options.mode 路由模式；history/hash。默认hash
   * @param {Object[]} options.routes 路由数组
   */
  constructor (options) {
    this.mode = options.mode || 'hash' // 路由模式
    this.routes = options.routes || [] // 路由
    this.routeMap = this.createRouteMap(this.routes) // 路由映射
    /*
      定义响应式，MyVueRouter.current要是响应式的
      current指向当前的路由，当current改变时，重新渲染对应的组件
    */
    Vue.util.defineReactive(this, 'current', this.computeCurrent())

    this.init() // 初始化
  }

  // 根据路劲计算当前路由
  computeCurrent () {
    let result

    if (this.mode === 'hash') {
      // 去掉开始的'#'
      result = window.location.hash && window.location.hash.slice(1)
    } else {
      result = window.location.pathname
    }

    // 默认'/'
    return result || '/'
  }

  // 更新当前路由
  updateCurrent () {
    console.log('更新当前路由')
    this.current = this.computeCurrent()
  }

  /**
   * 创建路劲和路由的映射。现在这个还只是单层的，也就是不能嵌套路由
   * @param {Object[]} routes 路由数组
   */
  createRouteMap (routes) {
    return routes.reduce((memo, route) => {
      memo[route.path] = route

      return memo
    }, {})
  }

  /**
   * 初始化
   */
  init () {
    // 判断路由模式
    if (this.mode === 'hash') {
      // hash模式
      this.initHashMode()
    } else {
      // history模式
      this.initHistoryMode()
    }
  }

  /**
   * 初始化hash路由模式
   */
  initHashMode () {
    // hash模式

    // 页面加载完成获取当前路由
    window.addEventListener('load', this.updateCurrent.bind(this))

    // window.location.hash改变时更新当前路由
    window.addEventListener('hashchange', this.updateCurrent.bind(this))
  }

  /**
   * 初始化history路由模式
   */
  initHistoryMode () {
    // history模式

    // 页面加载完成获取当前路由
    // window.addEventListener('load', this.updateCurrent.bind(this))

    // 前进或后退，更新当前路由
    window.addEventListener('popstate', this.updateCurrent.bind(this))
  }

  /**
   * 添加路由
   * @param {string} url 路由
   */
  push (url) {
    if (this.mode === 'hash') {
      // hash模式，直接修改路径的hash值
      window.location.hash = url
    } else {
      /*
        history模式，需要用history.pushState/replaceState
        history.pushState/replaceState不会触发popstate事件，需要手动更新路由
      */
      this.pushState(url)
      this.updateCurrent()
    }
  }

  /**
   * 替换路由
   * @param {string} url 路由
   */
  replace (url) {
    if (this.mode === 'hash') {
      // hash模式，直接修改路径的hash值
      window.location.hash = url
    } else {
      /*
        history模式，需要用history.pushState/replaceState
        history.pushState/replaceState不会触发popstate事件，需要手动更新路由
      */
      this.pushState(url, true)
      this.updateCurrent()
    }
  }

  /**
   * history模式，修改路由
   * @param {string} url 路由
   * @param {boolean} isReplace 是否是替换，默认false
   */
  pushState (url, isReplace = false) {
    const history = window.history

    isReplace
      ? history.replaceState({ key: history.state.key }, '', url)
      : history.pushState({ key: Date.now() }, '', url)
  }
}

// Vue安装插件方法
MyVueRouter.install = function (Vue) {
  // 全局混入$router变量
  Vue.mixin({
    beforeCreate () {
      // $options.router存在则表示是根组件。$options.router是Vue实例时传入的MyVueRouter实例
      if (this.$options && this.$options.router) {
        // 根组件
        // 所有实例都要有$router属性，并且用的都是同一个路由器实例
        Vue.prototype.$router = this.$options.router
        console.log('路由器信息：', this.$router)
      }
    }
  })

  // 注册全局组件
  Vue.component('router-view', {
    render (h) {
      // 修改数据会触发两次方法
      console.log('router-view------render')
      // 找到当前路由对应的组件，然后渲染
      const router = this.$router // 路由器实例
      /* 当前路由，由于当前路由已经是响应式，所以history.current改变时会重新执行渲染函数，渲染出对应的组件 */
      const current = router.current
      const routeMap = router.routeMap // 路由映射

      console.log('匹配到的组件：', routeMap[current].component)

      /*
        异步组件，会在加载完成时再次调用render函数进行渲染，否则无法显示组件
        所以异步组件，第一次匹配时在控制台中会看到调用两次render，后续会正常的只执行一次render
        参考:https://github.com/VenenoFSD/Blog/issues/18
      */
      return h(routeMap[current].component)
    }
  })

  Vue.component('router-link', {
    props: {
      // 目标路由
      to: {
        type: [Object, String],
        require: true
      },
      // 渲染标签，默认a标签
      tag: {
        type: String,
        default: 'a'
      },
      // 是否是替换，默认false
      replace: {
        type: Boolean,
        default: false
      }
    },
    render (h) {
      const data = {}

      if (this.tag === 'a') {
        // a标签直接设置href，a标签href点击会刷新页面要阻止默认事件
        data.attrs = {
          href: this.$router.mode === 'hash' ? `#${this.to}` : this.to
        }
        data.on = {
          click: (e) => {
            const router = this.$router

            this.replace
              ? router.replace(this.to)
              : router.push(this.to)
            e.preventDefault()
          }
        }
      } else {
        // 非a标签，设置点击事件
        data.on = {
          click: () => {
            const router = this.$router

            this.replace
              ? router.replace(this.to)
              : router.push(this.to)
          }
        }
      }

      return h(this.tag, data, this.$slots.default)
    }
  })
}

// export default MyVueRouter
