const path = require('path')
const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class UploadController extends Controller {
  async upload() {
    const ctx = this.ctx
    const parts = ctx.multipart()
    // 校验参数
    // 如果不传第二个参数会自动校验`ctx.request.body`
    this.ctx.validate({
      title: {type: 'string'},
      content: {type: 'string'}
    })
    this.ctx.status = 201
  }
}

module.exports = UploadController