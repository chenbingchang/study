const execa = require('execa');

// execa('echo', ["hello world"]).then(result => {
//   console.log(`执行命令: ${result.command} \n执行结果: ${result.stdout}`)
// })
execa("grep",["hello","index.js"]).then(result => {
  console.log(`执行命令: ${result.command} \n执行结果: ${result.stdout}`)
}).catch(err => console.log(err));