/**
 * 把命名好的原文*.js文件里面每个key的value   和    翻译好原文译文的excel对应起来，
 * 最终生成译文的*.js文件
 * @date: 2021-01-20
 */

const fs = require("fs")
const XLSX = require('xlsx')
const dataObj  = require('./assets/origin'); // 原文的i18n文件

const excelPath = './assets/translate.xlsx' // 原文、译文映射excel
const outputPath = './dist/translate.js' // 译文的i18n文件
const ORIGIN_COL_HEAD = '原文' // excel原文列第一行的内容
const TRANSLATE_COL_HEAD = '译文' // excel译文列第一行的内容

// 读取excel内容
const workbook = XLSX.readFile(excelPath)
// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
// 根据表名获取对应某张表
const worksheet = workbook.Sheets[sheetNames[0]];
// 得到这样的数组  [{ '模块': '首页', '原文': '待处理', '译文': 'Pending' }]
const list = XLSX.utils.sheet_to_json(worksheet)

/**
 * 遍历对象，修改对象原文对应的译文
 * @param {Object} obj 
 */
function forEachObject(obj) {
  for(let key in obj) {
    let value = obj[key]

    if(typeof value === 'object') {
      // 如果是对象，递归
      forEachObject(value)
    } else {
      const index = list.findIndex(item => item[ORIGIN_COL_HEAD] && item[ORIGIN_COL_HEAD].trim() === value.trim())

      if(index !== -1) {
        obj[key] = list[index][TRANSLATE_COL_HEAD] // 修改对象的值
        list.splice(index, 1) // 已经匹配过的译文则删除，减少后续的循环次数
      }
    }
  }
}

// 遍历对象
forEachObject(dataObj)


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