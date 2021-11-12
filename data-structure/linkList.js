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
// console.log(linkArr.head);


/**
 * 反转单链表
 * @param {Object} head 单链表的表头
 * 时间复杂度: O(2n)
 * 空间复杂度：O(n)
 */
function reverLinkList(head) {
  // 链表里的所有元素。从整体看elList，会发现他像是栈结构一样，先进后出
  let elList = [];

  // 下一个元素，从表头开始
  let nextEl = head;
  // 循环链表
  while (nextEl !== null) {
    // 把当前的元素保存到数组
    elList.push(nextEl);
    // 改变下一个元素
    nextEl = nextEl.next;
  }

  // 倒序遍历elList，并且重新链接上即可
  let i = elList.length - 1;
  // 新的表头指向最后一个元素
  let newHead = elList[i];

  while(i > -1) {
    // 当前元素
    let curNode = elList[i];
    // 下一个元素，默认null
    let nextNode = null;

    if (i > 0) {
      // 因为是倒序，所以下一个，其实是数组中的前面一个
      nextNode = elList[i - 1];
    }

    // 修改当前元素的next指针
    curNode.next = nextNode;

    // 改变循环变量
    i--;
  }

  return newHead;
}

/**
 * 反转单链表，迭代反转法，保存当前节点、前节点、后节点，然后改变next方向
 * 时间复杂度: O(n)
 * 空间复杂度：O(1)
 * @param {Object} head 表头
 * @returns 
 */
function reverLinkList_2(head) {
  // 因为要反转，所以前节点，一开始是null
  let pre = null;
  let cur = head;

  while (cur !== null) {
    // 先保存后节点，因为改变当前节点的next时，当前节点和后节点的链断开，如果不保存后节点，会导致丢失指针而不知道轮到那个节点
    let nextTemp = cur.next;

    // 反转当前节点
    cur.next = pre;
    // 反转完成后，当前节点变成前节点。后节点变成当前节点
    pre = cur;
    cur = nextTemp;
  }

  // 全部反转完，前节点就是最后的节点，也就是反转后的第一个节点（表头）
  return pre;
}

/**
 * 和迭代反转法的思想恰好相反，递归反转法的实现思想是从链表的尾节点开始，依次向前遍历，遍历过程依次改变各节点的指向，即另其指向前一个节点。
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * 递归的方法不好，会导致调用栈溢出
 * @param {*} head 
 */
function reverLinkList_3(head) {
  // 空链、链表尾部，则返回，要当新链的表头
  if (head === null || head.next === null) {
    return head;
  } else {
    let newHead = reverLinkList_3(head.next);

    // 后节点的next指向当前节点，进行反转
    head.next.next = head;
    // 当前节点next指向null
    head.next = null;

    return newHead;
  }
}

/**
 * 头插法，是指在原有链表的基础上，依次将位于链表头部的节点摘下，然后采用从头部插入的方式生成一个新链表，则此链表即为原链表的反转版。
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
function reverLinkList_4(head) {
  let newHead = null;
  let cur = head;

  while(cur !== null) {
    // 先保存下一个节点
    let nextNode = cur.next;
    // 当前节点的next指向newHead
    cur.next = newHead;
    // newHead再指向当前节点
    newHead = cur;

    // 指向下一个节点
    cur = nextNode;
  }

  return newHead;
}

/**
 * 就地逆置法
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
function reverLinkList_5(head) {
  let start = head;
  let end = start ? start.next : null;

  while (start && start.next !== null) {
    // 开始节点指向结束节点的下个节点
    start.next = end.next;
    // 改变结束节点的指向
    end.next = head;
    // 表头指向结束节点
    head = end;

    // 改变结束节点
    end = start.next;
  }

  return head;
}

console.log("####################################");
console.log(reverLinkList_5(linkArr.head));