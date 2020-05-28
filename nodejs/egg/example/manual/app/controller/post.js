const Controller = require('../core/base_controller')

class PostController extends Controller {
  async list() {
    // 读取cookie
    this.ctx.cookies.get('userId')
    this.ctx.cookies.set('count', 10)
    // 获取session
    const userId = this.ctx.session.userId
    // 修改session的值
    this.ctx.session.visited = 'asdf'

    const posts = await this.service.listByUser(this.user)
    this.success(posts)
  }
}

module.exports = PostController
