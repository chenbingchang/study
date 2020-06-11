/**
 * Created by lidy on 2019/10/25.
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    quotes: ['error', 'single'], // 强制使用单引号
    semi: ['error', 'never'], // 强制不使用分号结尾
    'indent': ['error', 2],
  },
  // parserOptions: {
  //   parser: 'Esprima',
  // },
}
