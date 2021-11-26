/* 
静态链表： "数组+游标" 的方式存储具有线性关系数据的存储结构就是静态链表。
静态链表中，除了数据本身通过游标组成的链表外，还需要有一条连接各个空闲位置的链表，称为备用链表
a[0] 默认不存储数据元素，cur指向0表示结束。a[0]存储备用链表的表头
a[1] 一般用来存储数据链的表头
参考：http://data.biancheng.net/view/163.html
*/

// 节点
class NodeOfArr {
  // 存放数据
  data = null
  // 后继元素的下标
  cur = 0

  constructor(data, cur) {
    this.data = datat
    this.cur = cur
  }
}

class StaticLinkList {
  // 存放两个链表的数组
  list = []
  // 静态链表的大小
  size = 0

  /**
   * a[0]是备用链表的表头，a[1]是数据链表的表头
   * @param {number} size 静态链表的大小
   */
  constructor(size) {
    this.list = Array(size)
    this.size = size

    // 初始化数组
    for (let i = 0; i < size; i++) {
      list[i] = new NodeOfArr(null, i)
    }
    // 链尾的cur为0
    list[size - 1].cur = 0
  }

  /**
   * 在数据链表的表头添加元素
   * @param {*} data 数据
   */
  unshift(data) {
    if (this.isEmpty()) {
      // 原来是空链表
      this.list[1].data = data
      this.list[1].cur = 0
      return true
    }

    let freeCur = this.malloc()

    if (freeCur === 0) {
      console.error("链表已经没有空闲的位置")
      return false
    }

    // 先保存旧的表头
    let oldHead = this.list[1]

    // 把旧的表头移到新的空闲的位置
    this.list[freeCur].data = oldHead.data
    this.list[freeCur].cur = oldHead.cur
    // 更新新表头的信息
    this.list[1].data = data
    this.list[1].cur = freeCur

    return true
  }

  /**
   * 在数据链表的表尾添加元素
   * @param {*} data 数据
   */
  push(data) {
    let freeCur = this.malloc()

    if (freeCur === 0) {
      console.error("链表已经没有空闲的位置")
      return false
    }

    // 先更新节点的数据、指向
    this.list[freeCur].data = data
    this.list[freeCur].cur = 0
    
    // 找到表尾的在静态链表的下标
    let lastCur = this.findCur(null)

    if (lastCur === -1) {
      // 数据链表为空
      return true
    }

    // 表尾的cur指向新的节点下标
    this.list[lastCur].cur = freeCur
  }
  
  /**
   * 在指定数据链表下标插入节点
   * 如果数据链表为空、大于数据链表最大下标，则插入尾部
   * 如果下标小于0，则当0
   * @param {number} dataIndex 在数据链表中的下标，null表示最后一个
   * @param {*} data 数据
   * @returns {*} 插入的数据，失败返回null
   */
  insert(dataIndex, data) {
    // 静态链表已经满了无法再插入，返回null
    if(this.isFull()) {
      return null
    }

    // 下标小于0，或者数据链表为空，则当0
    if (dataIndex < 0 || this.isEmpty()) {
      dataIndex = 0
    }

    // 插入尾部
    if(dataIndex === null) {
      let isSuccess = this.push(data)
      return isSuccess ? data : null
    } else if(dataIndex === 0) {
      // 插入头部
      let isSuccess =  this.unshift(data)
      return isSuccess ? data : null
    }

    // 查找前继元素的下标
    let preCur = this.findCur(dataIndex - 1)
    let preNode = this.list[preCur]
    // 新的下标
    let newCur = this.malloc()
    let newNode = this.list[newCur]
    // 保存下一个的下标
    let nextCur = preNode.cur

    // 修改新的节点的信息
    newNode.data = data
    newNode.cur = nextCur
    // 更新前继元素的cur
    preNode.cur = newCur

    return data
  }

  /**
   * 删除在数据链表中指定下标的节点
   * @param {number} dataIndex 在数据链表中的下标，null表示最后一个
   * @returns {*} 返回删除位置的数据
   */
  delete(dataIndex) {
    // 数据链表为空，返回null
    if (this.isEmpty || dataIndex < 0) {
      return null;
    }

    if (dataIndex === 0) {
      // 删除数据链表的表头，需要维持list[1]是数据链表中的表头，后继元素要移到list[1]的位置
      // 表头
      let head = this.list[1]
      // 要删除节点的数据
      let deleteData = head.data
      // 下一个节点
      let nextNode = this.list[head.cur]
      // 需要回收的下标
      let recoverCur
      
      // 更新表头的数据
      head.data = nextNode.data
      if (head.cur === 0) {
        // 数据链表中只有表头一个元素
        recoverCur = 1
      } else {
        recoverCur = head.cur
        // 更新表头的后继元素
        head.cur = nextNode.cur
      }

      // 回收
      this.recover(recoverCur)

      return deleteData
    } else {
      // 前继元素的下标
      let preCur = this.findCur(dataIndex - 1)
      // 没有找到前继元素
      if (preCur === -1) {
        return null
      }

      let preNode = this.list[preCur]
      if (preNode.cur === 0) {
        // 要删除下标的前继元素已经是最后的节点，说明要删除的下标节点不存在
        return null
      }

      // 要删除的节点
      let deleteNode = this.list[preNode.cur]
      // 要删除节点的数据
      let deleteData = deleteNode.data
      // 需要回收的下标，即要删除节点的下标
      let recoverCur = preNode.cur

      // 改变前继元素的指向
      preNode.cur = deleteNode.cur
      // 回收
      this.recover(recoverCur)

      return deleteData
    }
  }

  /**
   * 判断数据链表是否为空
   * @returns {boolean} 结果
   */
  isEmpty() {
    return this.list[1].data === null
  }

  /**
   * 判断静态链表是否满了，如果没有备用链表数据则是满了
   * @returns {boolean} 结果
   */
  isFull() {
    return this.list[0].cur === 0
  }

  /**
   * 静态链表的大小
   * @returns {number} 静态链表的大小
   */
  getSize() {
    return this.size
  }

  /**
   * 申请一个空闲的位置
   * @returns {number} 空闲的下标，如果是0则表示没有空闲的位置了
   */
  malloc() {
    // 备用链表头
    let freeHead = this.list[0]
    // 空闲的位置
    let freeCur = freeHead.cur

    // 改变备用链表头的后继元素
    freeHead.cur = this.list[freeCur].cur

    return freeCur
  }

  /**
   * 回收某一个下标的位置
   * @param {number} cur 在静态链表中的下标
   */
  recover(cur) {
    // 当前备用链表的表头
    let head = this.list[0]
    // 需要回收掉下标
    let recover = this.list[cur]

    // 清空数据
    recover.data = null
    // 改变指向，指向为表头的后继元素
    recover.cur = head.cur
    // 改变表头的指向，指向回收的下标
    head.cur = cur
  }

  /**
   * 查找数据链表中指定下标在静态链表的下标。
   * 如果大于数据链表的最大下标或者到了数据链表的表尾还没找到则返回表尾在静态链表中的下标
   * @param {number | null} dataIndex 在数据链表中的下标，null表示最后一个
   * @return {number} 静态链表的下标，数据链表为空则返回-1
   */
  findCur(dataIndex) {
    // 静态链表的下标
    let cur = 1
    // 数据链表中的下标
    let n = 0
    // 从数据链表的表头
    let node = this.list[1]

    // 数据链表的表头为空
    if (node.data === null) {
      return -1
    }

    while (node.cur !== 0) {
      // 下标相等
      if (n === dataIndex) {
        break
      }

      // 更新节点
      node = this.list[node.cur]
      cur = node.cur
      // 下标+1
      n++
    }

    return cur
  }
}
