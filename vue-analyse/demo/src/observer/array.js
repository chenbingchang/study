let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)

// 数组变异方法
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // ...args   args是一个数组，哪怕传参只有一个
    const result = oldArrayProtoMethods[method].apply(this, args)
    const ob = this.__ob__
    let inserted

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }

    if(inserted && inserted.length) {
      ob.observeArray(inserted)// 对新增的每一项进行观测
    }

    ob.dep.notify()

    return result
  }
})