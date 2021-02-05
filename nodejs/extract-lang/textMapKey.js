/**
 * 为了方便复制、粘贴vue i18n文件中文本对应的 $t('xxx')
 * 从原来的key: '内容'的形式，生成新的key: { text: "内容", value: "$t('xxx.key')" } 格式
 * @date: 2021-01-23
 */

const fs = require("fs")
const dataObj  = require('./assets/origin'); // 原文的i18n文件
const outputPath = './dist/originMapKey.js' // 译文的i18n文件
const BASE_HEADS = ['calendarManage'] // 基础的头部

function forEachObject(obj, stack = []) {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if(typeof value === 'object') {
        // 如果是对象，递归
        stack.push(key)
        forEachObject(value, stack)
        stack.pop(key)
      } else {
        const finalStack = BASE_HEADS.length ? BASE_HEADS.concat(stack, key) : stack.concat(key)

        obj[key] = {
          text: value,
          value: `$t('${finalStack.join('.')}')`
        }
      }
    }
  }
}

// 处理原来的对象
forEachObject(dataObj, [])
// 最终生成的文件内容
let text = `export default ${JSON.stringify(dataObj)}`
// 写入文件
fs.writeFile(outputPath, text, function(err) {
  if(err) {
    console.log('写文件失败')
  } else {
    console.log('写入成功，请查看。')
  }
})