let indexEl = document.getElementById('index')
let btnEl = document.getElementById('btn')
let listEl = document.getElementsByClassName('list')[0]
let num = 0

btnEl.onclick = function (e) {
  let index = indexEl.value

  if (index) {
    index = parseInt(index)
  }

  let newLiEl = document.createElement('li')
  newLiEl.classList.add('item')
  newLiEl.innerText = `${++num}`

  listEl.appendChild(newLiEl)
}