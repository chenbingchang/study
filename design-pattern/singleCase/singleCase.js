/**
 * 单例模式
 * 只有一个实例
 */
// 假设要设置一个管理员，多次调用也仅设置一次，我们可以使用闭包缓存一个内部变量来实现这个单例
function SetManager(name) {
  this.manager = name
}

SetManager.prototype.getName = function() {
  console.log(this.manager)
}



const getSingleton = function(fn) {
  let instance = null

  return function() {
    // 不存在才创建，存在就会就直接返回
    if(!instance) {
      instance = fn.apply(this, arguments)
    }

    return instance
  }
}

let managerSingleton = getSingleton(function(name) {
  var manager = new SetManager(name)
  return manager
})



// 分别创建了3个，但是只有第一次的设置是有效的
managerSingleton('a').getName()
managerSingleton('b').getName()
managerSingleton('c').getName()
