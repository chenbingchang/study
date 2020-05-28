const Server = require('./server')
const Router = require('./router')

Server.start(Router.route)