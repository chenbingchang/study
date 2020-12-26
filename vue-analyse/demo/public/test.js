let appEl = document.querySelector("#app")
let testEl = document.querySelector("#test")

console.log(appEl.nextSibling)
console.log(testEl.nextSibling)

appEl.parentNode.insertBefore(testEl, appEl.nextSibling)