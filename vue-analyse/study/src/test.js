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

// function A () {

// }

// A.prototype.n = 1

// var b = new A()

// A.prototype = {
//   n: 2,
//   m: 3
// }

// var c = new A()
// console.log(b.n, b.m, c.n, c.m)


// var F = function() {}
// Object.prototype.a = function() {
//   console.log('a()')
// }
// Function.prototype.b = function() {
//   console.log('b()')
// }

// var f = new F()

// f.a()
// f.b()
// F.a()
// F.b()

let str = "啊"

console.log('啊', str.codePointAt(0))