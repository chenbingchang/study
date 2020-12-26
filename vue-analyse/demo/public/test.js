let appEl = document.querySelector("#app")

function sum() {
  with(this) {
    return 'Hello World'
  }

  // add(this) {
  //   return 'Hello World 2'
  // }
}

console.log(sum())