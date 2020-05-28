const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const newsList = await ctx.service.news.list(page);
    await ctx.render('news/list.tpl', { list: newsList });
    // 获取query参数
    ctx.query
    ctx.queries
    // 获取路劲param
    ctx.params.projectId
    ctx.params.detailId
    // 获取请求body
    ctx.request.body.title
    ctx.request.body.content

  }
}

module.exports = NewsController;