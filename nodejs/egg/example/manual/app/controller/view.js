const Controller = require('egg').Controller

class ViewController extends Controller {
  async show() {
    this.ctx.body = {
      name: 'err',
      category: 'framework',
      language: 'node.js'
    }
  }
  async page() {
    this.ctx.body = '<html><h1>Hello egg</h1></html>'
  }
  async proxy() {
    const ctx = this.ctx
    const result = await ctx.curl(url, {
      streaming: true
    })

    ctx.set(result.header)
    ctx.body = result.res
  }
}