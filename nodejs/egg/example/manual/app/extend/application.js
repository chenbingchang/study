const BAR = Symbol('Application#bar');

module.exports = {
  foo(param) {
    // this就是app对象，
  },
  get bar() {
    if(!this[BAR]) {
      this[BAR] = this.config.xx + this.config.yy;
    }

    return this[BAR]
  }
}