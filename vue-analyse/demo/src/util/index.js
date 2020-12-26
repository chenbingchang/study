export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

const strats = {}

/**
 * 合并钩子函数
 * @param {*} parentValue 钩子函数数组
 * @param {*} childValue 
 */
function mergeHook(parentValue, childValue) {
  if(childValue) {
    if(parentValue) {
      return parentValue.concat(childValue)
    } else {
      return [childValue]
    }
  } else {
    return parentValue
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

/**
 * 合并选项
 * @param {*} parent 
 * @param {*} child 
 */
export function mergeOptions(parent, child) {
  const options = {}

  for(let key in parent) {
    mergeField(key)
  }

  for(let key in child) {
    if(!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    // 判断是否是钩子函数配置
    if(strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      if(typeof parent[key] == 'object' &&　typeof child[key] == 'object') {
        options[key] = {
          ...parent[key],
          ...child[key] 
        }
      } else {
        options[key] = child[key]
      }
    }
  }

  return options
}

/**
 * 调用钩子函数
 * @param {*} vm 
 * @param {*} hook 
 */
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]

  if(handlers) {
    for(let i = 0, len = handlers.length; i < len; i++) {
      handlers[i].call(vm)
    }
  }
}