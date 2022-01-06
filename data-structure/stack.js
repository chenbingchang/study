/**
 * 顺序栈
 */
 class Stack {
  // 存放数据，进出都在尾部操作
  list = [];

  /**
   * 入栈
   * @param {*} data 数据
   */
  push (data) {
    this.list.push(data);
  }

  /**
   * 出栈
   * @returns {*} 出栈的数据，空栈返回null
   */
  pop () {
    if (this.isEmpty()) {
      return null;
    }

    let data = this.list.pop();

    return data;
  }

  /**
   * 栈是否为空
   * @returns {boolean} 是否为空
   */
  isEmpty () {
    return this.list.length === 0;
  }
}

/**
 * 链栈节点
 */
class StackNode {
  // 数据
  data = null;
  // 指向
  next = null;

  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

/**
 * 链栈，入栈、出栈都在头部操作
 */
class LinkStack {
  // 头指针
  head = null;

  /**
   * 入栈
   * @param {*} data 数据
   */
  push (data) {
    // 创建新节点
    let node = new StackNode(data, this.head);

    // 头指针指向新节点
    this.head = node;
  }

  /**
   * 出栈
   * @returns {*} 出栈的数据，空栈返回null
   */
  pop () {
    if (this.isEmpty()) {
      return null;
    }

    let data = this.head.data;
    // 头指针指向下一个
    this.head = this.head.next;

    return data;
  }

  /**
   * 栈是否为空
   * @returns {boolean} 是否为空
   */
  isEmpty () {
    return this.head === null;
  }
}

let stack = new Stack();
console.log(stack.isEmpty());
stack.push('A');
stack.push('B');
stack.push('C');
stack.push('D');
console.log(stack);
console.log(stack.isEmpty());

let p1 = stack.pop();
console.log(p1);
console.log(stack);

let p2 = stack.pop();
console.log(p2);
console.log(stack);


console.log("######################################");
let linkStack = new LinkStack();
console.log(linkStack.isEmpty());

linkStack.push('A');
linkStack.push('B');
linkStack.push('C');
linkStack.push('D');
console.log(linkStack);
console.log(linkStack.isEmpty());

console.log(linkStack.pop());
console.log(linkStack);

console.log(linkStack.pop());
console.log(linkStack);