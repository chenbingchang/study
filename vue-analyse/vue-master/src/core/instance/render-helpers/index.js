/* @flow */

import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
import { renderList } from './render-list'
import { renderSlot } from './render-slot'
import { resolveFilter } from './resolve-filter'
import { checkKeyCodes } from './check-keycodes'
import { bindObjectProps } from './bind-object-props'
import { renderStatic, markOnce } from './render-static'
import { bindObjectListeners } from './bind-object-listeners'
import { resolveScopedSlots } from './resolve-slots'

export function installRenderHelpers (target: any) {
  target._o = markOnce //
  target._n = toNumber // 变成数字
  target._s = toString // 变成字符串
  target._l = renderList // 渲染列表
  target._t = renderSlot // 渲染slot
  target._q = looseEqual //
  target._i = looseIndexOf //
  target._m = renderStatic // 渲染静态节点
  target._f = resolveFilter // 过滤器
  target._k = checkKeyCodes // 按键码
  target._b = bindObjectProps //
  target._v = createTextVNode  // 创建文本节点
  target._e = createEmptyVNode // 创建空节点
  target._u = resolveScopedSlots // 目标插槽
  target._g = bindObjectListeners //
}
