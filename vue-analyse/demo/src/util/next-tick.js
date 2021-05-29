let callbacks = [] // 回调函数数组

// 清空回调函数数组
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}

let timerFunc

// 根据不同的环境实现timerFunc函数
if(Promise) {// then是异步方法，并且是在微任务中执行
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if(MutationObserver) { // MutationObserver也是异步方法
  // 通过监听文本节点的内容来触发回调，
  let observe = new MutationObserver(flushCallbacks) // H5的api
  let textNode = document.createTextNode(1)

  observe.observe(textNode, {
    characterData: true
  })
  // 运行方法时改变内容触发MutationObserver的回调函数
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if(setImmediate) { // 这个好像只有ie支持
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb) {
  callbacks.push(cb)
  timerFunc()
}