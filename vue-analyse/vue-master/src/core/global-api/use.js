/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // Vue._installedPlugins记录安装过的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // // 1.如果安装过这个插件直接跳出
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)// 2.获取参数并在参数中增加Vue的构造函数
    args.unshift(this) // 把Vue放到第一个参数
    // 3.执行install方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 4.记录安装的插件
    installedPlugins.push(plugin)
    return this
  }
}
