exports.keys = 'cbc_eig12%69sdf*16h_581#re'
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
}
// 添加 news 的配置项
exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
}
// add middleware robot
exports.middleware = [
  'robot'
]
// robot's configurations
exports.robot = {
  ua: [
    /curl/i,
    /Baiduspider/i
  ]
}
// 配置需要的中间件，数组顺序即为中间件的加载顺序
exports.middleware = ['gzip']
// 配置gzip中间件的配置
exports.gzip = {
  threshold = 1024 // 小于 1k 的响应体不压缩
}
// 配置bodyParser中间件
exports.bodyParser = {
  jsonLimit: '1mb',
  formLimit: '1024mb'
}