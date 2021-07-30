// import MyVueRouter from './myVueRouter'

Vue.use(MyVueRouter)

const router = new MyVueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: { template: '<div>home页面</div>' }
    },
    {
      path: '/test',
      component: { template: '<div>test页面</div>' }
    },
    {
      path: '/about',
      component: { template: '<div>about页面</div>' }
    }
  ]
})

const bank = {
  name: 'FastBull'
}

Vue.util.defineReactive(bank, 'count', 0)

Vue.component('result', {
  render (h) {
    console.log('result组件---render')
    const txt = `${bank.name}的余额：${bank.count}`

    return h('div', txt)
  }
})

new Vue({
  router,
  el: '#app',
  data: {
    message: 'Hello Vue study !'
  },
  methods: {
    addCount () {
      bank.count += 3
    }
  }
})
