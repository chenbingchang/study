/**
 * 
 * @param {*} oldVnode 老节点
 * @param {*} vnode 新增节点，一定是vnode类型
 */
export function patch(oldVnode, vnode) {
  // vnode没有nodeType，但真正的js元素有nodeType
  const isRealElement = oldVnode.nodeType

  if(isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode

    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)

    return el
  }
}

/**
 * 根据vnode创建真正的dom元素
 * @param {*} vnode 
 */
function createElm(vnode) {
  let {tag, children, key, data, text} = vnode

  if(typeof tag === 'string') {
    // 元素节点
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      // 添加子节点
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

/**
 * 更新vnode的真实元素的属性
 * @param {*} vnode 
 */
function updateProperties(vnode) {
  let newProps = vnode.data || {} // 获取当前新节点的属性
  let el = vnode.el // 当前的真实节点

  for(let key in newProps) {
    if(key === 'style') {
      // 样式
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if(key === 'class') {
      el.className = newProps.class
    } else { // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key])
    }
  }
}