'use strict';

module.exports = app => {
  console.log('###############################');

  app.once('server', server => {
    console.log(server);
  });

  app.on('error', (err, ctx) => {
    if (err) {
      console.log('异常：', err);
      return;
    }

    console.log(ctx);
  });

  app.on('request', ctx => {
    console.log('请求上下文：', ctx);
  });

  app.on('response', ctx => {
    console.log('响应上下文：', ctx);
  });
};
