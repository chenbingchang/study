/*
深度拷贝，深度优先、广度优先两种算法
*/

/**
 * 深度优先深拷贝
 * @param {Object} src 源对象
 * @return {Object} 目标对象
 */
function deepCopyByDeep(src) {
  // debugger
  // 非对象、数组，直接返回
  if (!["object", "array"].includes(getTypeOfValue(src))) {
    return src
  }

  let dest = getInitDestParent(src)
  // 将递归变成循环，深度优先
  let args = [
    { keys: getSrcParentKeys(src), srcParent: src, destParent: dest },
  ] // 初始化参数列表

  while (args.length) {
    //只要还有参数就执行
    const arg = args[0] // 从最前面开始
    const { keys, srcParent, destParent } = arg

    // 如果该层的keys遍历完，则删除
    if (!keys.length) {
      args.shift()
      continue // 下一轮
    }

    const key = keys.shift() // 拿最前面的key
    const value = srcParent[key] // 对应的值

    // 引用类型，需要保存对应的数据到args最前面，因为是深度优先
    if (["object", "array"].includes(getTypeOfValue(value))) {
      destParent[key] = getInitDestParent(value) // 初始化对应的属性
      const keysOfValue = getSrcParentKeys(value)

      // 非空对象，才需要再循环。空对象只需要初始化就已经完成了
      if (keysOfValue.length) {
        args.unshift({
          keys: keysOfValue, // 对应的key数组
          srcParent: value, // 读取的对象
          destParent: destParent[key], // 写入的对象
        })
      }
      continue
    }

    // 基本类型直接复制值
    destParent[key] = value
  }

  return dest
}

/**
 * 检查值的类型
 * @param {*} value 值
 * @return {string} 类型
 */
function getTypeOfValue(value) {
  const typeStr = Object.prototype.toString.call(value)
  let result

  switch (typeStr) {
    case "[object Undefined]":
      result = "undefined"
      break
    case "[object Null]":
      result = "null"
      break
    case "[object Number]":
      result = "number"
      break
    case "[object String]":
      result = "string"
      break
    case "[object Boolean]":
      result = "boolean"
      break
    case "[object Symbol]":
      result = "symbol"
      break
    case "[object Object]":
      result = "object"
      break
    case "[object Array]":
      result = "array"
      break
    case "[object Function]":
      result = "function"
      break
    case "[object Set]":
      result = "set"
      break
    case "[object WeakSet]":
      result = "weakSet"
      break
    case "[object Map]":
      result = "map"
      break
    case "[object WeakMap]":
      result = "weakMap"
      break
    default:
      result = ""
      break
  }
  return result
}

/**
 * 根据源父级类型，返回目标父级的初始化值，后续会把属性从源父级复制到目标父级
 * @param {*} srcParent 源父级
 * @return {*} 目标父级的初始化值
 */
function getInitDestParent(srcParent) {
  const srcParentType = getTypeOfValue(srcParent)
  let destParent

  switch (srcParentType) {
    case "object":
      // 源父级是对象，目标父级是空对象
      destParent = {}
      break
    case "array":
      // 源父级是数组，目标父级是空数组
      destParent = []
      break
    default:
      // 其它类型之间返回（这里先不考虑Set/Map/Function类型）
      destParent = srcParent
      break
  }

  return destParent
}

/**
 * 获取源父级的属性数组
 * @param {*} srcParent 源父级
 * @return {array} 属性数组
 */
function getSrcParentKeys(srcParent) {
  const srcParentType = getTypeOfValue(srcParent)
  let keys = []

  switch (srcParentType) {
    case "object":
      // 源父级是对象，key则是属性名
      keys = Reflect.ownKeys(srcParent)
      break
    case "array":
      // 源父级是数组，keys则是下标
      keys = srcParent.map((item, index) => index)
      break
    // 别的类型不会进入到这里，哈哈哈
  }

  return keys
}

let jack = {
  groups: ['a', 'b'],
  list: ["aaa", {name: "bbbb"}, [0, 1, 2]],
  name: "jack.ma",
  age: 40,
  like: {
    dog: {
      color: "black",
      age: 3,
      obj: {},
    },
    cat: {
      color: "white",
      age: 2,
    },
  },
}
let jack2 = deepCopyByDeep(jack)

//比如修改jack2中的内容，不会影响到jack中的值
jack2.groups[0] = "cc"
console.log("jack2: ", jack2.groups[0]) //打印出来的应该是 "green"
console.log("jack: ", jack.groups[0]) //打印出来的应该是 "black"