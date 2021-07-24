/* @flow */

import { makeMap, isBuiltInTag, cached, no } from 'shared/util'

let isStaticKey // 判断静态属性的key的函数
let isPlatformReservedTag // 判断平台保留的标签的函数

const genStaticKeysCached = cached(genStaticKeys)

/**
 * 标记静态节点，优化性能
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  // 判断静态属性的key的函数
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  // 判断平台保留的标签的函数
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  // 标记静态节点
  markStatic(root)
  // second pass: mark static roots.
  // 标记静态根节点
  markStaticRoots(root, false)
}

// 生成静态属性的key
function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

// 标记静态节点
function markStatic (node: ASTNode) {
  node.static = isStatic(node) // 标记当前节点
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) && // 不是平台保留的标签
      node.tag !== 'slot' && // 不是slot标签
      node.attrsMap['inline-template'] == null // 不是内嵌模板
    ) {
      /*
      不是平台保留的标签，并且也不是slot和component，即是自己定义的组件
      因为在上面isStatic判断的时候就肯定是非静态标签，所以这里直接返回
       */
      return
    }
    // 遍历子节点
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i] // 子节点
      markStatic(child)
      // 只要有孩子节点不是静态的，那么父节点也不是静态的
      if (!child.static) {
        node.static = false
      }
    }
    // 如果节点有条件判断
    if (node.ifConditions) {
      // 遍历带有条件的子节点
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

// 标记静态根节点
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) { // 元素节点
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    // 为了使节点有资格作为静态根节点，它应具有不只有一个静态文本的子节点。 否则，优化的成本将超过收益，最好始终将其更新。
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      // 遍历子节点
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      // 遍历条件
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}

// 是否是静态节点
function isStatic (node: ASTNode): boolean {
  /*
  type: 1:元素节点; 2:包含变量的动态文本节点; 3:不包含变量的纯文本节点
  */
  if (node.type === 2) { // expression   包含变量的动态文本节点
    return false
  }
  if (node.type === 3) { // text   不包含变量的纯文本节点
    return true
  }
  /*
  如果节点使用了v-pre指令，那就断定它是静态节点；
  如果节点没有使用v-pre指令，那它要成为静态节点必须满足：
  不能使用动态绑定语法，即标签上不能有v-、@、:开头的属性；
  不能使用v-if、v-else、v-for指令；
  不能是内置组件，即标签名不能是slot和component；
  标签名必须是平台保留标签，即不能是组件；
  当前节点的父节点不能是带有 v-for 的 template 标签；
  节点的所有属性的 key 都必须是静态节点才有的 key，注：静态节点的key是有限的，它只能是type,tag,attrsList,attrsMap,plain,parent,children,attrs之一；
  */
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings   没有动态绑定
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in    不是内置标签
    isPlatformReservedTag(node.tag) && // not a component   不是组件
    !isDirectChildOfTemplateFor(node) && // 不是父元素是template循环出来的
    Object.keys(node).every(isStaticKey) // key 都必须是静态节点才有的 key
  ))
}

// 判断是否是从父级的template循环出来的
function isDirectChildOfTemplateFor (node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent // 父节点
    if (node.tag !== 'template') { // 父节点标签不是template，返回false
      return false
    }
    if (node.for) { // 父节点有v-for，返回true
      return true
    }
  }
  return false
}
