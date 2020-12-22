function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    alert(this.name)
  }
}

var person1 = new Person('Zaxlct', 28, 'Software Engineer');
var person2 = new Person('Mick', 23, 'Doctor');

/*
函数对象和普通对象都有constructor/__proto__属性

函数对象还多了prototype属性（原型对象）
Object.prototype




*/

let effect = function() {
  console.log('执行了effect方法')
}

effect.scheduler = function() {
  console.log('执行了effect.scheduler方法')
}
