/* @flow */

import config from '../config'
import Dep from '../observer/dep'
import Watcher from '../observer/watcher'
import { isUpdatingChildComponent } from './lifecycle'

import {
  set,
  del,
  observe,
  observerState,
  defineReactive
} from '../observer/index'

import {
  warn,
  bind,
  noop,
  hasOwn,
  hyphenate,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isServerRendering,
  isReservedAttribute
} from '../util/index'

const sharedPropertyDefinition = {
  enumerable: true, // 可枚举
  configurable: true, // 可配置
  get: noop,
  set: noop
}

/*
代理
用 target.key 代理 target.sourceKey.key
这样props里面的属性即vm._props，就可以直接在vm上使用
比如vm._props.xxx，可以直接用vm.xxx就可以了，这也是为什么props/data/computed/methods可以直接this.xxx的形式访问
 */
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

// 初始化状态
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  // 如果存在某选项就初始化它
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

// 初始化props
function initProps (vm: Component, propsOptions: Object) {
  // 父组件传入的真实props数据。
  const propsData = vm.$options.propsData || {}
  // 指向vm._props的指针，所有设置到props变量中的属性都会保存到vm._props中。
  const props = vm._props = {}
  // 缓存props对象中的key，将来更新props时只需遍历vm.$options._propKeys数组即可得到所有props的key
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  // 当前组件是否为根组件。
  const isRoot = !vm.$parent
  // root instance props should be converted    根实例props是响应式的
  observerState.shouldConvert = isRoot
  // 遍历props
  for (const key in propsOptions) {
    keys.push(key)
    // 校验prop的值，并返回最终的值
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      // 判断是否是保留的属性
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      // 将每个prop都放到vm._props中做响应式
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}

// 初始化data
function initData (vm: Component) {
  let data = vm.$options.data
  // 如果是方法，执行方法
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    // data值不是对象，发出警告
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data) // data所有键数组
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i] // 键
    if (process.env.NODE_ENV !== 'production') {
      // 如果methods中存在相同的键，则警告
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) { // 如果data属性已经在props中存在则报错
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 非保留属性，则挂载到实例上
      proxy(vm, `_data`, key)
    }
  }
  // observe data   响应式数据
  observe(data, true /* asRootData */)
}

function getData (data: Function, vm: Component): any {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  }
}

// 懒加载
const computedWatcherOptions = { lazy: true }

// 初始化computed
function initComputed (vm: Component, computed: Object) {
  // computed属性的watchers，存放对应的watcher
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  // 遍历所有属性
  for (const key in computed) {
    // 用户的配置
    const userDef = computed[key]
    // 之前computed选择已经统一标准化处理过
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      // getter为Null警告
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      /*
      不是服务端渲染，创建watcher。
      为了后面的computed属性缓存做准备，依赖改变时才重新计算，否则使用上一次的值
       */
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}

// 定义computed
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 非服务端渲染才缓存
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    // userDef是方法
    // 设置get/set
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } else {
    // userDef是对象
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key) // 有缓存
        : userDef.get // 没有缓存
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  // 如果非生产，并且set没有，则个set设置是警告的函数
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  // 给目标对象定义属性
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

// 创建computed的get，具有缓存功能的get
function createComputedGetter (key) {
  // computed的get
  return function computedGetter () {
    // 拿到key对应的watcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      // 脏数据，马上更新数据
      if (watcher.dirty) {
        watcher.evaluate()
      }
      // 如果该computed有被别的watcher调用，则要对该watcher进行依赖收集
      if (Dep.target) {
        watcher.depend()
      }
      // 返回computed的最新值
      return watcher.value
    }
  }
}

// 初始化methods选项
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  // 遍历methods里面的键值
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          `Method "${key}" has an undefined value in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    // 把方法的this指向vm实例上，再加到实例中
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}

// 初始化watch
function initWatch (vm: Component, watch: Object) {
  // 遍历
  for (const key in watch) {
    // 配置项
    const handler = watch[key]
    if (Array.isArray(handler)) {
      // 数组，要触发多个方法
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

// 创建watcher
function createWatcher (
  vm: Component,
  keyOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 对象，则对象中handler是处理函数
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  // 字符串，是组件中methods中的函数
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  // 在后面stateMixin中声明
  return vm.$watch(keyOrFn, handler, options)
}

export function stateMixin (Vue: Class<Component>) {
  // 声明实例的属性/方法
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData: Object) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef) // _data的别名
  Object.defineProperty(Vue.prototype, '$props', propsDef) // _props的别名

  Vue.prototype.$set = set // 响应式的set别名
  Vue.prototype.$delete = del // 响应式的del别名

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      // 值是对象，需要转换一下，但最终还是通过再调$watch来实现
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true // 标记用户添加
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      // 用当前watch的值，立即执行一次
      cb.call(vm, watcher.value)
    }
    // 返回取消观察函数
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
