const Controller = require('egg').Controller

class UserController extends Controller {
  async fetch() {
    const {app, ctx} = this
    const id = ctx.request.query.id
    ctx.response.body = app.cache.get(id)
    ctx.body = ctx.helper.formatUser(user)
    
  }
}

module.exports = UserController