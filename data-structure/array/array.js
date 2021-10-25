/**
 * 数组，这里模拟的是可以动态扩容的。如果是静态的，当数组满的时候需要重新申请更大的内存，然后进行数据迁移
 */
class MyArray {
  // 数组
  list = [];
  // 数组长度
  length = 0;
  
  /**
   * 构造函数
   * @param {number} length 数组的长度，默认0
   */
  constructor(length = 0) {
    this.list = new Array(length);
    this.length = length;
  }

  /**
   * 新增元素
   * @param {number} index 新增的下标
   * @param {*} val 新增的元素
   */
  add(index, val) {
    if(index < this.length) {
      // 如果新增下标在现有下标范围内，则从这个位置到末尾的部分需要向后移1位
      this.backMove(index);
    } else {
      // 如果新增的下标超过最大下标则长度也要修改
      this.changeLength(1);
    }

    this.list[index] = val;
  }

  /**
   * 删除元素
   * @param {number} index 开始删除的下标，包括这个下标
   * @param {number} delNum 删除的数量，默认1
   */
  delete(index, delNum = 1) {
    this.forwardMove(index + delNum, delNum);
  }

  /**
   * 更新指定下标的元素，如果大于最大下标则当新增元素处理
   * @param {number} index 更新的下标
   * @param {*} val 更新的元素
   */
  set(index, val) {
    // 大于最大下标则当新增元素处理
    if (index >= this.length) {
      this.add(index, val);

      return;
    }

    this.list[index] = val;
  }

  /**
   * 获取指定下标的元素
   * @param {number} index 要获取的下标
   * @returns {*} 下标对应的元素
   */
  get(index) {
    return this.list[index];
  }

  /**
   * 在数组尾部添加元素
   * @param {*} val 添加元素
   */
  push(val) {
    this.add(this.length, val);
  }

  /**
   * 在数组头部添加元素
   * @param {*} val 添加元素
   */
  unshift(val) {
    this.add(0, val);
  }

  /**
   * 删除数组尾部的元素
   */
  pop() {
    this.delete(this.length - 1);
  }

  /**
   * 删除数组头部的元素
   */
  shift() {
    this.delete(0);
  }

  /**
   * 数组后移
   * @param {number} startIndex 开始后移的下标，默认0
   * @param {number} offset 移几位，默认1
   */
  backMove(startIndex = 0, offset = 1) {
    // 后移0位，直接返回
    if (offset === 0) {
      return;
    }

    // 末尾的下标
    let i = this.length - 1;
    
    // 从末尾开始移
    while(i >= startIndex) {
      this.list[i + offset] = this.list[i];
      i--;
    }

    // 原来的位置要清空
    for(let j = startIndex; j < startIndex + offset; j++) {
      this.list[j] = null;
    }

    // 后移后会多出offset位，长度要+offset
    this.changeLength(offset);
  }

  /**
   * 数组前移
   * @param {number} startIndex 开始前移的下标
   * @param {number} offset 移几位，默认1
   */
  forwardMove(startIndex, offset = 1) {
    // 开始下标大于最大下标
    if (startIndex >= this.length) {
      return;
    }
    // 最大可以前移几位
    let maxOffset = startIndex;

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // 前移0位，直接返回
    if(offset === 0) {
      return;
    }

    // 从前往后
    for (let i = startIndex; i < this.length; i++) {
      this.list[i - offset] = this.list[i];
    }

    // 前移了几位，数组就减少几位
    this.changeLength(-offset);
  }

  /**
   * 数组长度改变，因为this.length改变后并不能真正改变this.list的长度，需要手动修改this.list数组的长度。
   * 没有指针类型写数据结构就是有些问题
   * @param {number} offset 改变的长度，可正、可负
   */
  changeLength(offset) {
    this.length += offset;
    // 同步修改list的长度
    this.list.length = this.length;
  }

  /**
   * 打印
   */
  toString() {
    let result = "";

    for (let index = 0; index < this.length; index++) {
      const element = this.list[index];

      result += element + ",";
    }

    if (result) {
      // 去掉最后多余的", "
      result = result.substring(0, result.length - 1);
    }

    return result;
  }
}

let arr = new MyArray(4);

arr.set(0, "aaa");
arr.set(1, "bbb");
arr.set(2, "ccc");
console.log("原来的元素");
console.log(arr.toString());

console.log("新增一个");
arr.add(2, "新增的一个")
console.log(arr.toString());

console.log("修改");
arr.set(2, "修改了")
console.log(arr.toString());

console.log("删除");
arr.delete(3)
console.log(arr.toString());