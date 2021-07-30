import Vue from 'vue'

/**
 * vuex-demo
 */
class Store {
  constructor (options) {
    // 为了state是响应式的，直接创建一个Vue的实例
    this.state = new Vue({
      data: (options && options.state) || {}
    })
    // 初始化mutations
    this.mutations = (options && options.mutations) || {}
    // 初始化getters
    options.getters && this.initGetters(options.getters)
    // 初始化actions
    this.actions = (options && options.actions) || {}
  }

  /**
   * 初始化getters
   * @param {Object} getters 配置项
   */
  initGetters (getters) {
    this.getters = {}

    // 遍历所有配置
    Reflect.ownKeys(getters).forEach(key => {
      // 在this.getters上定义key
      Reflect.defineProperty(this.getters, key, {
        get: () => {
          // 执行配置的getter函数，并且把state放到第一个参数
          return getters[key](this.state)
        }
      })
    })
  }

  /**
   * 提交，这里要使用箭头函数。
   * 因为在actions里面异地再提交一下commit（
   * 如：addOneAsync({ commit }, params) {
            setTimeout(() => {
                commit('addOne', params)
            }, 1000)
        }）,
      那么会导致this中的上下文产生变化,
   * 不再指向Store实例就报一个mutations of undefined的错误
   * @param {*} type 提交的mutations
   * @param {*} params 参数
   */
  commit = (type, params) => {
    // 执行对应的mutations，并且把state放到第一个参数
    this.mutations[type] && this.mutations[type](this.state, params)
  }

  /**
   * 分发。跟mutations和commit类似
   * @param {*} type 提交的actions
   * @param {*} params 参数
   */
  dispatch (type, params) {
    this.actions[type] && this.actions[type]({
      state: this.state,
      commit: this.commit,
      dispatch: this.dispatch
    }, params)
  }
}

// Vue安装插件函数
function install (Vue) {
  // 全局混入$store变量
  Vue.mixin({
    beforeCreate () {
      // this.$options.store则表示是根组件
      if (this.$options.store) {
        // 在原型对象上加属性，这样每个实例都可以访问到同一个Store实例
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
