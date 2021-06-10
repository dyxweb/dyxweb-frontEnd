## new操作符
### new操作符的作用
1. 创建一个新对象
2. 设置对象的原型等于构造函数的原型对象
3. 执行构造函数， 属性和方法被添加到this引用的对象中
4. 如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。

### 实现new操作符
```
function myNew(Con, ...args) {
  // 创建空对象
  let obj = {};
  // 设置空对象的原型(链接对象的原型)
  obj._proto_ = Con.prototype;
  // 绑定 this 并执行构造函数(为对象设置属性)
  let result = Con.apply(obj, args)
  // 如果Con没有返回对象就返回obj
  return result instanceof Object ?  result : obj;
}
// 构造函数
function Test(name, age) {
  this.name = name
  this.age = age
}
Test.prototype.sayName = function () {
  console.log(this.name)
}

// 实现一个 new 操作符
const a = myNew(Test, 'dyx', '24')
console.log(a.age)
```