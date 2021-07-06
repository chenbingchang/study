/*
MessageChannel 创建消息通道，类似一根管子，有两个端口，在一个端口说话，另一个端口可以听见
*/
var port1El = document.querySelector('#port1')
var port2El = document.querySelector('#port2')

var channel = new MessageChannel()
var port1 = channel.port1
var port2 = channel.port2

port1.onmessage = function(event) {
  console.log('port1收到来自port2的数据', event.data)
}

port2.onmessage = function(event) {
  console.log('port2收到来自port1的数据', event.data)
}



port1El.onclick = function() {
  console.log('点击port1El-------#####')
  port1.postMessage({
    name: 'cbc',
    age: 26,
    desc: '我是一名程序员'
  })
  console.log('点击port1El执行完成-------#####')
}

port2El.onclick = function() {
  console.log('点击port2El------@@@@@@')
  port2.postMessage(["三体", '斗罗', '大陆'])
  console.log('点击port2El执行完成------@@@@@@')
}

let str = 'aabbcc gg wo'

let newStr = str.replace(/aa|gg/g, match => {
  console.log(match)
  return "**"
})

console.log(newStr)
