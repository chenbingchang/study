const {
  createApp,
  reactive,
  computed,
  // 当前版本并没有暴露effect composition-api
  // effect
} = Vue
const MyComponent = {
  template: `
      <button @click="click">
      {{ state.message }}
      </button>
  `,
  setup() {
      const state = 
      reactive({
          message:'Hello world!!',
          arr: [1,2]
      })
      // effect(() => {
      //     console.log('state change ', state.message)
      // })
      function click() {
          state.message = state.message.split('').reverse().join('')
          console.log(state.arr.includes(1))
      }
      return {
          state,
          click
      }
  }
}
createApp(MyComponent).mount('#app')