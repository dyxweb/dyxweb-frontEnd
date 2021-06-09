### this的作用
> 提供了一个非常便捷的方式,传递一个隐式的引用让代码变得更加简洁同时也会让代码更合理的复用。

### 普通函数的this指向
- 谁调用函数，this指向谁
```
// 全局调用
function test() {
 const name = "dyx";
 console.log(this.name); // undefined，全局作用域中没有name变量所以为undefined
 console.log(this); // window
}
test(); // this指向调用它的那个对象，在这里相当于window.test();所以this指向window

// 对象的方法形式调用
const obj = {
 name: "dyx",
 test: function() {
   console.log(this.name); // dyx
   console.log(this); // 指向obj对象
 }
}
obj.test(); // 此时this指向的是调用函数的对象obj。
const fn = obj.test;
fn(); // undefined, window  此时test的调用相当于全局调用所以this指向window

// 深层次对象的方法调用
const obj = {
  name: "dyx",
  innerObj: {
    test: function() {
      console.log(this.name); // undefined，这里有两个对象obj和innerObj,调用函数的对象为innerObj，在该作用域中找不到声明的name变量
    }
  },
  test1: function() {
    console.log(this.name); // dyx
  }
}
obj.test1();
obj.innerObj.test();

// 输出二次undefined
let len = 10; // let不会在window上添加属性
function fn() {
  console.log(this.len) 
}
fn();

let person = {
  len: 5,
  say: function(){
    fn(); // 这里调用fn的this还是指向window
  }
}
person.say()
```
- setTimeout的this指向window
```
setTimeout(() => {
  console.log(this) // window
}, 0)

const obj = {
  fun: () => setTimeout(() => {
    console.log(this) // window
  }, 0),
}

obj.fun();
```
- new构造函数有return的内容this指向return的内容。没有return指向new出来的新对象
```
// new构造函数的形式的调用
function Test() { 
  this.name = 'dyx';
  return {}; 
}
var obj = new Test(); // {}
console.log(obj.name); // undefined,这里的this指向的是return返回的对象，是一个空对象，并没有name变量

// new构造函数的形式的调用
function Test1() { 
  this.name = 'dyx';
}
var obj = new Test1(); // { name: 'dyx' }
console.log(obj.name); // dyx, 这里的this指向的是new出来的新对象
```
### 箭头函数this的指向
- 箭头函数没有自己的this，如果箭头函数外层有函数，外层函数的this就是内部箭头函数的this，否则this就是window。箭头函数的this指向该函数定义时的作用域，而非指向调用函数的对象。
```
// 当我们创建对象的时候，是在全局作用域下创建的，而对象中的方法也是这时候创建的，所以这时候的this是指向全局的，而我们在fn2里面创建的对象，这个对象的方法的this就指向他被创建时的词法作用域obj了。
var str = 'window';   
const obj = {    
  str:'obj',    
  fn: () => console.log(this.str),   
  fn2: function() {	
    console.log(this.str)	
    return { 
      str: 'newObj',	    
      fn: () => console.log(this.str)
    }
  },  
}
 
obj.fn(); // window
 
var newObj = obj.fn2();  // obj
newObj.fn(); // obj
```
- 在call和apply的场景下，function函数和箭头函数中的this指向也不相同。箭头函数中的this并不会指向call或者apply函数中的第一个参数，第一个参数被忽略，而是指向了window对象。
- 不可以当作构造函数，不可以使用new命令，否则会抛出一个错误。
- 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。
- 不可以使用yield命令，因此箭头函数不能用作Generator函数。
- 箭头函数的prototype为undefined

### 改变函数this的指向
> call、apply、bind方法都可以改变this指向, this指向传入的第一个参数。bind方法改变后的函数想什么时候调用就什么时候调用，执行bind之后返回的是一个函数，bind方法也可以接收多个参数，并且参数可以执行的时候再次添加，但是要注意的是，参数是按照形参的顺序进行的，call和apply都是改变指向后立即调用此方法。apply的使用同call不同的是传入的参数需要是数组形式或者类数组形式。

- bind
> 改变之后可以自定义函数何时调用,bind方法会创建一个函数实例，this值会指向传给bind方法的第一个参数。

```
var obj = {
 name: "dyx",
 test: function(num1, num2, num3) {
   console.log(this); // obj1
   console.log(this.name); // douyaxing
   console.log(num1, num2, num3); // 10 1 2
 }
}
var obj1 = {
  name: 'douyaxing'
}
var fn = obj.test.bind(obj1, 10); // this 将会指向obj1
fn(1,2);
```
- 手写bind
```
Function.prototype.myBind = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fNOP = function () {};
  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(bindArgs);
    return self.apply(this instanceof fNOP ? this : context, finalArgs);
  }

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}

const obj = { name: 'douyaxing' }
var name = 'dyx'
function exer(age, sex) {
  console.log(this.name, age, sex)
}
exer(18, 'man')
const newExer = exer.myBind(obj, 23)
newExer('man')
```
- call
> 参数一个一个传入

```
var obj = {
  name: "dyx",
  test: function(c, d) {
    console.log(this); // obj1
    console.log(this.name); // douyaxing
    console.log(c + d); // 3
  }
}
var obj1 = {
  name: 'douyaxing'
}
var fn = obj.test;
fn.call(obj1, 1, 2); // 参数一个一个传入
```
- 手写call
```
// 形式1
Function.prototype.myCall = function(context) {
  var context = context || window;
  context.fn = this;
  var args = [];

  for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  var result = eval('context.fn(' + args +')');

  delete context.fn
  return result;
}

// 形式2
Function.prototype.myCall = function(context, ...args) {
  context = context || window
  context.fn = this
  let result = context.fn(...args)
  delete context.fn
  return result
}

// 使用
const obj = { name: 'douyaxing' }
const obj1 = { name: 'douyaxing23' }
var name = 'dyx'
function exer(age, sex) {
  console.log(this.name, age, sex)
}
exer(18, 'man')
exer.myCall(obj, '23', 'women')
exer.myCall(obj1, '2', 'women')
```
- apply
> 传入一个数组或者类数组作为参数，可以直接使用函数的arguments对象作为参数传递。

```
var obj = {
  name: "dyx",
  test: function(c, d) {
    console.log(this); // obj1
    console.log(this.name); // douyaxing
    console.log(c + d); // 3
  }
}
var obj1 = {
  name: 'douyaxing'
}
var fn = obj.test;
fn.apply(obj1, [1, 2]); 
```
- 手写apply
```
// 形式1
Function.prototype.myApply = function(context, arr) {
  var context = context || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')')
  }
  delete context.fn
  return result;
}

// 形式2
Function.prototype.myApply = function(context) {
  context = context || window
  context.fn = this
  let result
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}


const obj = { name: 'douyaxing' }
const obj1 = { name: 'douyaxing23' }
var name = 'dyx'
function exer(age, sex) {
  console.log(this.name, age, sex)
}
exer(18, 'man')
exer.myApply(obj, ['23', 'women'])
exer.myApply(obj1, ['2', 'women'])
```