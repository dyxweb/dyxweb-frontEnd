## api
### instanceof
- instanceof操作符左侧是一个普通对象，右侧是一个构造函数，用于检测构造函数的prototype是否出现在某个实例对象的原型链上。
```
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

console.log(auto instanceof Car); // true
console.log(auto instanceof Object); // true
```
### isPrototypeOf()
- isPrototypeOf()不关心构造函数，用于检查一个对象是否存在于另一个对象的原型链上。
```
function Foo() {}
function Bar() {}

Bar.prototype = Object.create(Foo.prototype);

const bar = new Bar();

console.log(Foo.prototype.isPrototypeOf(bar)); // true
console.log(Bar.prototype.isPrototypeOf(bar)); // true
```
### instanceof VS isPrototypeOf()
- instanceOf运算符侧重于检查构造函数的原型是否在对象的原型链上。
- isPrototypeOf()方法侧重于检查一个对象是否在另一个对象的原型链上。
### Object.getPrototypeOf
- 获取实例对象的原型。
```
// Person构造函数
function Person() {}

// 在Person的原型对象上挂载属性和方法
Person.prototype.name = 'dyx';
Person.prototype.age = 26;
Person.prototype.getName = function() {
  return this.name;
}
 
const dyx = new Person();
Object.getPrototypeOf(dyx) === Person.prototype // true
```
### hasOwnProperty
- for in循环将循环遍历对象本身以及它所委托的原型的所有可枚举属性，添加到原型的任何属性都是可枚举的(使用 in 操作符检查对象中是否含有某个属性时同理)。
- hasOwnProperty返回一个布尔值，表示对象是否具有指定的属性作为其自身的属性，而不是对象所委托的原型上的属性。
```
function Animal(name, energy) {
  this.name = name;
  this.energy = energy;
}
Animal.prototype.eat = function(amount) {
  console.log(`${this.name} is eating.`);
  this.energy += amount;
}
 
const leo = new Animal('Leo', 7);
for (let key in leo) {
  console.log(key); // name、energy、eat
}

for (let key in leo) {
  if (leo.hasOwnProperty(key)) {
    console.log(key); // name、energy
  }
}
```
