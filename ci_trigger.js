/**
 * 接受远程调用的钩子，然后调用脚本部署相关应用
 * @author chenbingchang
 * @date 2021-03-10
 * 格式：/hook/trigger?token=xxxx&appName=xxxx&env=xxxx&port=xxxx
 * @param {string} token 令牌
 * @param {string} appName 应用名称
 * @param {string} env 构建环境，dev/test/stage/prod
 * @param {string} port 对外的端口
 */

const http = require('http')
const execSync = require('child_process').execSync;

http.createServer(function(request, response) {
  let result = handle(request)

  // 响应
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.write(result); 
  response.end();
}).listen(5001)

/**
 * 处理请求
 * @param {Object} request 请求对象
 * @returns {string} 响应结果
 */
function handle(request) {
  // 响应结果
  let result = ''
  const urlObj = new URL(request.url, 'http://cbingc.com:5001')
  const searchParams = urlObj.searchParams
  const token = searchParams.get('token')
  const appName = searchParams.get('appName')
  const env = searchParams.get('env')
  const port = searchParams.get('port')

  // 路劲必须是/hook/trigger
  if(urlObj.pathname !== '/hook/trigger') {
    result = '路劲不正确，请按照格式：/hook/trigger?token=xxxx&appName=xxxx&env=xxxx&port=xxxx'
    return result
  }
  // 校验token
  if(token !== 'w353here0535are5yo0ucom7e9fr4o0m') {
    result = '令牌错误'
    return result
  }
  if(!appName) {
    result = '项目名称不能为空'
    return result
  }
  if(!env) {
    result = '环境不能为空'
    return result
  }
  if(!port) {
    result = '外部访问端口不能为空'
    return result
  }


  const cmdStr = `/bin/bash /root/CI_CD/start.sh ${appName} ${env} ${port}`

  // 同步执行命令
  try {
    let stdout = execSync(cmdStr)
    result = `执行命令: ${cmdStr}\n执行结果：\nstdout: ${stdout}\n`
    console.log('执行命令: ', cmdStr)
  } catch (error) {
    console.log(`执行命令：${cmdStr}   出错`)
    result =  `执行命令报错：${cmdStr}`
  }

  return result
}

console.log('开始监听，端口：5001')