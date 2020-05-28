const http = require('http')

let options = {
  host: 'localhost',
  port: '3000',
  path: '/index.html'
}

function callback(response) {
  let body = ''
  response.on('data', function(data) {
    body += data
  })
  response.on('end', function(data) {
    console.log(body)
  })

}

let req = http.request(options, callback)
req.end()