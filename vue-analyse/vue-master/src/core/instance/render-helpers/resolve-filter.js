/* @flow */

import { identity, resolveAsset } from 'core/util/index'

/**
 * Runtime helper for resolving filters
 */
export function resolveFilter (id: string): Function {
  // 查找过滤函数
  return resolveAsset(this.$options, 'filters', id, true) || identity
}
