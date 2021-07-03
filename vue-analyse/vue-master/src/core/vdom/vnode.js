/* @flow */

// 虚拟DOM
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  functionalContext: Component | void; // real context vm for functional nodes
  functionalOptions: ?ComponentOptions; // for SSR caching
  functionalScopeId: ?string; // functioanl scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag // 节点的标签名
    this.data = data // 节点对应的对象，包含了具体的一些数据信息，比如类名、绑定、事件、其它属性，是一个VNodeData类型，可以参考VNodeData类型中的数据信息
    this.children = children // 节点的子节点数组
    this.text = text // 节点的文本
    this.elm = elm // 节点对应的真实dom节点
    this.ns = undefined // 节点的命名空间
    this.context = context // 节点对应的Vue实例
    this.functionalContext = undefined // 函数式组件对应的Vue实例
    this.functionalOptions = undefined //
    this.functionalScopeId = undefined //
    this.key = data && data.key // 节点的key属性，被当作节点的标志，用以优化
    this.componentOptions = componentOptions // 组件的option选项
    this.componentInstance = undefined // 节点对应的组件的实例
    this.parent = undefined // 节点的父节点
    this.raw = false // 是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
    this.isStatic = false // 静态节点标志
    this.isRootInsert = true // 是否作为根节点插入
    this.isComment = false // 是否为注释节点
    this.isCloned = false // 是否为克隆节点
    this.isOnce = false // 是否有v-once指令
    this.asyncFactory = asyncFactory // 异步组件工厂
    this.asyncMeta = undefined //
    this.isAsyncPlaceholder = false //
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

// 创建注释节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true // 为啥要标记为注释节点
  return node
}

// 创建文本节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// 创建克隆节点，主要是为了做模板编译优化时使用
// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode, deep?: boolean): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.isCloned = true // 标记为克隆
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children)
  }
  return cloned
}

// 创建克隆节点数组，一般是某个节点的子节点
export function cloneVNodes (vnodes: Array<VNode>, deep?: boolean): Array<VNode> {
  const len = vnodes.length
  const res = new Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep)
  }
  return res
}
