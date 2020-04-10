/**
 * touch事件
 * @date 2020-03-31
 * 参考：https://juejin.im/post/5a996388f265da23884c8113
 * https://juejin.im/post/5b3cc9836fb9a04f9a5cb0e0
 */


/* if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
} */

const box1El = document.getElementById('box')
const box2El = document.getElementById('box2')


box1El.addEventListener('touchstart', (e) => {
  console.log('box1El touchstart')
  console.log(e)

  setTimeout(() => {
    console.log('250ms after')
  }, 250)
})
box1El.addEventListener('click', (e) => {
  console.log('box1El click')
})
box1El.addEventListener('touchend', (e) => {
  console.log('box1El touchend')
})

/* box2El.addEventListener('touchstart', (e) => {
  console.log('box2El touchstart')
  box2El.style.display = 'none'
}) */
/* box2El.addEventListener('click', (e) => {
  console.log('box2El click')
  box2El.style.display = 'none'
}) */

/**
 * tap事件任然会存在点击穿透，因为click 300ms的延迟，去掉click 300ms延迟就可以了(比如：fastclick/meta标签设置/css touch-action等)
 * @param {*} ele 
 * @param {*} callback 
 */
function tap(ele, callback) {
  // 记录开始时间
  var startTime = 0,
  // 控制允许延迟的时间
      delayTime = 200,
  // 记录是否移动，如果移动，则不触发tap事件
      isMove = false;

  // 在touchstart时记录开始的时间
  ele.addEventListener('touchstart', function (e) {
    startTime = Date.now();
  });

  // 如果touchmove事件被触发，则isMove为true
  ele.addEventListener('touchmove', function (e) {
    isMove = true;
  });

  // 如果touchmove事件触发或者中间时间超过了延迟时间，则返回，否则，调用回调函数。
  ele.addEventListener('touchend', function (e) {
    if (isMove || (Date.now() - startTime > delayTime)) {
      return; 
    } else {
      callback(e);
    }
  })
}

// tap(box2El, function(e) {
//   console.log(e)
//   box2El.style.display = 'none'
//   console.log('box2El tap 事件')
// })
