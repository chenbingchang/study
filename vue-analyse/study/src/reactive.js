const toProxy = new WeakMap() // 存放被代理过的对象
const toRaw = new WeakMap() // 存放已经代理过的对象

function reactive(target) {
  // 创建响应式对象
  return createReactiveObject(target);
}

function isObject(target) {
  return typeof target === 'object' && target !== null;
}

function hasOwn(target, key) {
  return target.hasOwnProperty(key);
}

function createReactiveObject(target) {
  // 判断target是不是对象,不是对象不必继续
  if (!isObject(target)) {
    return target;
  }

  let observed = toProxy.get(target)

  if (observed) { // 判断是否被代理过
    return observed;
  }
  if (toRaw.has(target)) { // 判断是否要重复代理
    return target;
  }

  const handlers = {
    get(target, key, receiver) { // 取值
      console.log('获取 ' + key)
      let res = Reflect.get(target, key, receiver);
      if (res._isRef) {
        // isRef是对基本类型的响应式数据不需要依赖收集
        return res.value
      }
      track(target, 'get', key); // 依赖收集

      // 如果是对象继续代理
      return isObject(res) ? reactive(res) : res;
    },
    set(target, key, value, receiver) { // 更改 、 新增属性
      // console.log('设置 ' + key)
      let oldValue = target[key] // 获取上次的值
      let hadKey = hasOwn(target, key) // 看这个属性是否存在
      let result = Reflect.set(target, key, value, receiver);

      if (!hadKey) {
        console.log('更新 添加' + key)
        trigger(target, 'add', key); // 触发添加
      } else if (oldValue !== value) {
        console.log('更新 修改' + key)
        trigger(target, 'set', key); // 触发修改
      }
      return result;
    },
    deleteProperty(target, key) { // 删除属性
      console.log('删除 ' + key)
      const result = Reflect.deleteProperty(target, key);
      return result;
    }
  }
  // 开始代理
  observed = new Proxy(target, handlers);
  toProxy.set(target, observed)
  toRaw.set(observed, target) // 做映射表

  return observed;
}


// effect实现
function effect(fn, options) {
  const effect = createReactiveEffect(fn, options); // 创建响应式的effect
  if (!options.lazy) { // 如果是lazy则不立即执行
    effect(); // 先执行一次
  }
  return effect;
}

const activeReactiveEffectStack = []; // 存放响应式effect

function createReactiveEffect(fn, options) {
  const effect = function () {
    // 响应式的effect
    return run(effect, fn);
  };
  effect.scheduler = options.scheduler
  return effect;
}

function run(effect, fn) {
  try {
    activeReactiveEffectStack.push(effect);
    return fn(); // 先让fn执行,执行时会触发get方法，可以将effect存入对应的key属性
  } finally {
    activeReactiveEffectStack.pop(effect);
  }
}

const targetMap = new WeakMap();

function track(target, type, key) {
  // 查看是否有effect
  const effect = activeReactiveEffectStack[activeReactiveEffectStack.length - 1];
  if (effect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) { // 不存在map
      targetMap.set(target, depsMap = new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) { // 不存在set
      depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(effect)) {
      dep.add(effect); // 将effect添加到依赖中
    }
  }
}

function trigger(target, type, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return
  }
  let effects = depsMap.get(key);
  if (effects) {
    effects.forEach(effect => {
      if (effect.scheduler) { // 如果有scheduler说明不需要执行effect
        effect.scheduler() // 将dirty设置为true，下次获取值时重新执行runner方法
      } else {
        effect(); // 否则就是effect 正常执行即可
      }
    })
  }

  // 处理如果当前类型是增加属性，如果用到数组的length的effect应该也会被执行
  if (type === 'add') {
    let effects = depsMap.get("length");
    if (effects) {
      effects.forEach(effect => {
        effect();
      })
    }
  }
}

// 测试
// let school = [1,2,3];
// let p = reactive(school);
// effect(()=>{
//     console.log(p.length);
// })
// p.push(100);



// ref实现   ref可以将原始数据类型也转换成响应式数据，需要通过.value属性进行获取值
function convert(val) {
  return isObject(val) ? reactive(val) : val
}

function ref(raw) {
  raw = convert(raw)

  const v = {
    _isRef: true, // 标记是ref类型
    get value() {
      track(v, 'get', '')
      return raw
    },
    set value(newVal) {
      raw = newVal
      trigger(v, 'set', '')
    }
  }

  return v
}

// 测试
// let r = ref(1)
// let c = reactive({
//   a: r
// })
// console.log(c.a)


// computed实现
function computed(getter) {
  let dirty = true;
  const runner = effect(getter, { // 标识这个effect是懒执行
    lazy: true, // 懒执行
    scheduler: () => { // 当依赖的属性变化了，调用此方法，而不是重新执行effect
      dirty = true;
    }
  });
  let value;
  return {
    _isRef: true,
    get value() {
      if (dirty) {
        value = runner(); // 执行runner会继续收集依赖
        dirty = false;
      }
      return value;
    }
  }
}

// 测试
let a = reactive({
  name: 'youxuan'
});
let c = computed(() => {
  console.log('执行次数')
  return a.name + ' webyouxuan';
})
// 不取不执行，取n次只执行一次
console.log(c.value);
a.name = 'zf10' // 更改值  不会触发重新计算，但是会将dirty变为true
console.log(c.value); // 重新调用计算方法

export {
  reactive
}