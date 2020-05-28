module.exports = app => {
  app.once('server', server => {
    console.log('http服务器启动完成！')
  })
  app.on('error', (err, ctx) => {
    console.log('错误：' + err)
  })
  app.on('request', ctx => {
    console.log('request-----------');
    
  })
  app.on('response', ctx => {
    console.log('response-----------');
    
  })

  /* app.beforeStart(async () => {
    const ctx = app.createAnonymousContent()
    await ctx.service.posts.load()
  }) */
}