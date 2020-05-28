const http = require('http')
const url = require('url')

function start(route) {
  function onRequest(request, response) {
    let pathname = url.parse(request.url).pathname

    console.log('Request for ' + pathname + " received")

    route(pathname)
    
    response.writeHead(200, {
      'Content-type': 'text/plain'
    })
    response.write('Hello world come from ' + pathname)
    response.end()
  }

  http.createServer(onRequest).listen(8888)
  console.log('Server has started at port: 8888')
}

exports.start = start