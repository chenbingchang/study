/* @flow */

import config from '../config'
import { ASSET_TYPES } from 'shared/constants'
import { warn, isPlainObject } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) { // 如果没有第二个参数，则返回已经注册的
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) { // 非生产环境，组件是保留标签则警告
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }

        if (type === 'component' && isPlainObject(definition)) { // definition是对象
          definition.name = definition.name || id
          definition = this.options._base.extend(definition) // 组件通过继承即可实现
        }

        if (type === 'directive' && typeof definition === 'function') { // 指令，如果参数是方法，直接把方法绑定给bind和update配置
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
