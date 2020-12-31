import {arrayMethods} from './array';
import Dep from './dep';

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
    
    this.dep = new Dep() // 专门为数组设计的
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
  let childOb = observe(value)// 判断值是否也需要响应式
  let dep = new Dep()

  // 存取器函数
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) { // 如果取值时有watcher
        dep.depend() // 让watcher保存dep，并且让dep 保存watcher
        if(childOb) {
          childOb.dep.depend() // 收集数组依赖
          if(Array.isArray(value)) { // 如果内部还是数组
            depandArray(value) // 不停的进行依赖收集
          }
        }
      }

      return value
    },
    set(newValue) {
      // 相同直接返回
      if(newValue === value) {
        return
      }

      observe(newValue)
      value = newValue
      dep.notify() // 通知渲染watcher去更新
    }
  })
}

function depandArray(value) {
  for(let i = 0, len = value.length; i < len; i++) {
    let current = value[i]

    current.__ob__ &&　current.__ob__.dep.depend()
    if(Array.isArray(current)) {
      depandArray(current)
    }
  }
}

export function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return
  }

  return new Observer(data)
}