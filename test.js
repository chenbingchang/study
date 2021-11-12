const inputEl = document.getElementById("input");
const resultImgEl = document.getElementById("resultImg");



inputEl.onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader()

  reader.onload = e => {
    debugger;
    const base64 = e.target.result;
    const imgEl = new Image();
    const waterImgEl = new Image();
    const loadedImg = []

    imgEl.onload = function(e) {
      loadedImg.push(true)
      drawImage()
      
    }

    waterImgEl.onload = function(e) {
      loadedImg.push(true)
      drawImage()
    }

    imgEl.src = base64
    waterImgEl.src = "./static/image/watermark.png"

    // canvas画图
    function drawImage() {
      // 有图片没有加载完，直接返回
      if (loadedImg.length < 2) {
        return;
      }

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      
      // 画图片
      context.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height)
      // 再画水印
      context.drawImage(waterImgEl, 0, 0, waterImgEl.width, waterImgEl.height)

      // 获取最终结果
      const resultImgSrc = canvas.toDataURL("image/png")
      // 显示最终的图片
      resultImgEl.src = resultImgSrc

    
    
    }
  }

  reader.readAsDataURL(file)
  // 重置
  e.target.value = "";
};

inputEl.onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader()
  const img = new Image()

  reader.onload = e => {
    console.log("文件解析完成！")
    img.src = e.target.result;
  }

  img.onload = e => {
    console.log("图片加载完成！")
  }

  reader.readAsDataURL(file)
  // 重置
  e.target.value = "";
}

function run() {
  console.log("开始");
  
  console.log("执行1");
  throw new Error("手动抛出错误");
}

try {
  
  run()
} catch (error) {
  console.log("捕获run()的异常");
}
console.log("aaaa");
// run()
// console.log("bbbbb");
// setTimeout(run, 0)

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("https://www.baidu.com")
  }, 1000)
})

let p2 = p1;
console.log(p1, p2);

Promise.all([p1, p2]).then(([r1, r2]) => {
  console.log('r1', r1)
  console.log('r2', r2)
}).catch(e => {
  console.log("Promise.all   异常 ");
})


let styleEl =  document.getElementById("style")