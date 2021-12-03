let indexEl = document.getElementById('index')
let btnEl = document.getElementById('btn')
let listEl = document.getElementsByClassName('list')[0]
let totalEl = document.getElementById('total')
let num = 0
let firstHeight = listEl.clientHeight
let isFirstView = true

btnEl.onclick = function (e) {
  let index = indexEl.value

  if (index) {
    index = parseInt(index)
  }

  let newLiEl = document.createElement('li')
  newLiEl.classList.add('item')
  newLiEl.innerText = `${++num}`

  let itemList = document.querySelectorAll(".list .item")

  if (index > itemList.length) {
    listEl.appendChild(newLiEl)
  } else {
    listEl.insertBefore(newLiEl, itemList[index])
  }

  itemList = document.querySelectorAll(".list .item")

  for (let i = 0; i < itemList.length; i++) {
    let text = itemList[i].innerText
    let arr = text.split('----')
    let oldText = arr[1] ? arr[1] : text

    itemList[i].innerText = `偏移${i}个----${oldText}` 
  }

  totalEl.innerText = `总共：${num}个`

  window.requestAnimationFrame(function () {
    let firstChild = listEl.children[0]

    firstHeight += firstChild.offsetHeight + 20
  })
}


listEl.onscroll = function (e) {
  if (listEl.scrollTop > firstHeight) {
    isFirstView = false
  } else {
    isFirstView = true
  }
  console.log("是否首屏：", isFirstView);
}

window.onresize = function (e) {
  console.log("window大小重新调整");
  console.log(e);
}