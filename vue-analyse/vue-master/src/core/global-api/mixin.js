/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 把混合合并到options中，从而在后面的创建中使用options达到每个都有
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
