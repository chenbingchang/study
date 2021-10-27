/**
 * 节点
 */
class MyNode {
  // 当前值
  value = null
  // 指向下一个节点
  next = null

  constructor(value) {
    this.value = value
    this.next = null
  }
}

/**
 * 单向链表
 */
class LinkList {
  // 头部指针，指向第一个节点
  head = null
  // 元素数量
  count = 0

  constructor() {}

  /**
   * 获取指定下标的节点
   * @param {number} index 下标
   * @returns {MyNode | null} 下标对应的节点，链表为空则返回null
   */
  getNode(index) {
    //  大于最大下标，则取最大下标
    if (index > this.count - 1) {
      index = this.count - 1
    } else if (index < 0) {
      // 小于0，则当0
      index = 0
    }

    // 从头部开始
    let target = this.head

    // index的节点被上一个节点(index - 1)指向，所以只需要循环到上一个节点(index - 1)
    for (let i = 0; i < index; i++) {
      target = target.next
    }

    return target
  }

  /**
   * 获取指定下标的值
   * @param {number} index 下标
   * @returns {*} 下标对应的节点的值
   */
  get(index) {
    const node = this.getCount(index)

    return node && node.value
  }

  /**
   * 插入节点
   * @param {number} index 插入的下标
   * @param {*} value 插入的值
   * @returns {MyNode} 插入的节点
   */
  insert(index, value) {
    const insertNode = new MyNode(value)

    // 插入头部
    if (index <= 0) {
      // 插入节点指向当前的头部
      insertNode.next = this.head
      // 再改变头部的指向，指向插入节点
      this.head = insertNode
      // 数量+1
      this.count++

      return insertNode
    }

    const preNode = this.getNode(index - 1)

    // 插入节点，指向当前下标的节点
    insertNode.next = preNode.next
    // 前一个节点指向插入节点
    preNode.next = insertNode
    // 数量+1
    this.count++

    return insertNode
  }

  /**
   * 删除节点
   * @param {number} index 删除节点的下标
   * @returns {MyNode | null} 删除的节点
   */
  remove(index) {
    // 链表为空\大于最大下标，直接返回
    if (this.count === 0 || index > this.count - 1) {
      return null
    }

    // 要删除节点
    let delNode = null

    // 删除头部
    if (index <= 0) {
      delNode = this.head
      // 头节点指向下一个
      this.head = delNode.next
    } else {
      // 删除节点的前一个节点
      const preNode = this.getNode(index - 1)
      // 要删除节点
      delNode = preNode.next
      // 让上一个节点指向删除节点的后一个节点
      preNode.next = delNode.next
    }

    // 清空删除节点的指向
    delNode.next = null
    // 数量-1
    this.count--

    return delNode
  }

  /**
   * 更新节点的值
   * @param {number} index 要更新节点的下标
   * @param {*} value 新值
   */
  set(index, value) {
    // 下标不在范围内，直径返回
    if (index < 0 || index > this.count - 1) {
      return null
    }

    const node = this.getNode(index)
    node.value = value

    return node
  }

  /**
   * 获取元素数量
   * @returns {number} 元素数量
   */
  getCount() {
    return this.count
  }
}

let linkArr = new LinkList();

linkArr.insert(0, "aaa")
linkArr.insert(1, "bb")
linkArr.insert(2, "cc")
linkArr.insert(6, "dd")

console.log(linkArr.head);
// linkArr.remove(2)
// linkArr.set(2, ["数组", 'aaa'])
// console.log(linkArr.getNode(2));
console.log(linkArr.head);