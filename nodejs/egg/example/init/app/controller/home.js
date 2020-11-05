'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const a = '你好呀，欢迎使用';
    console.log(a + '你好呀，欢迎使用xxxx');
    console.log('########');

    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
