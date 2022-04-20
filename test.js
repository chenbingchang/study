// function test () {
//   console.log("开始");

//   setTimeout(function() {
//     console.log("setTimeout方法");
//   }, 0)

//   let p = new Promise(function (resolve, reject) {
//     console.log("Promise里面");
//     resolve("aaa")
//   })

//   p.then(() => {
//     console.log("then");
//     let p2 = new Promise(function (resolve, reject) {
//       console.log("新的promise里面");
//       resolve("aaa")
//     })
//     p2.then(() => {
//       console.log("新的promise的then");
//     })
//   })

//   console.log("结束");
// }

// test()

let total = 40

function zeroDelay() {
  total--
  console.timeEnd('执行间隔')
  console.log(Date.now())

  console.time('执行间隔')
  if (total) {
    setTimeout(zeroDelay, 200)
  }
}

console.time('执行间隔')
// setTimeout(zeroDelay, 200)

let arr = [71, 41, 64, 1, 8, 84, 32, 63, 28, 68]


function shellSort(arr) {
  var len = arr.length,
      temp,
      gap = 1;
  while(gap < len/3) {          //动态定义间隔序列
      gap =gap*3+1;
  }
  for (gap; gap > 0; gap = Math.floor(gap/3)) {
      for (var i = gap; i < len; i++) {
          temp = arr[i];
          for (var j = i-gap; j >= 0 && arr[j] > temp; j-=gap) {
              arr[j+gap] = arr[j];
          }
          arr[j+gap] = temp;
      }
  }
  return arr;
}

console.log(shellSort(arr));

// gap = 4; i = 4
  0   1   2  3  4   5   6   7   8   9
[71, 41, 64, 1, 8, 84, 32, 63, 28, 68]

// i = 5
[8, 41, 64, 1, 71, 84, 32, 63, 28, 68]
// i = 6
[8, 41, 64, 1, 71, 84, 32, 63, 28, 68]

