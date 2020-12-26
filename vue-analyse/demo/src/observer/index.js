import {arrayMethods} from './array';

/**
 * 观测值
 */
class Observer {
  constructor(value) {
    // 增加__ob__属性，其实是增加一个访问自己的属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    })

    if(Array.isArray(value)) {
      value.__proto__ = arrayMethods // 重写数组原型方法
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(data) {
    // 让对象上的所有属性依次进行观测
    let keys = Object.keys(data)

    for(let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let value = data[key]

      definedReactive(data, key, value)
    }
  }

  observeArray(value) {
    for(let i = 0, len = value.length; i < len; i++) {
      observe(value[i])
    }
  }
}

/**
 * 定义响应式
 * @param {Object} data 
 * @param {*} key 
 * @param {*} value 
 */
function definedReactive(data, key, value) {
  observe(value)// 判断值是否也需要响应式

  // 存取器函数
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      // 相同直接返回
      if(newValue === value) {
        return
      }

      observe(newValue)
      value = newValue
    }
  })
}

export function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return
  }

  return new Observer(data)
}