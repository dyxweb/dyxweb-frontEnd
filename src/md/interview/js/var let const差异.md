## var let const差异
### var声明的变量会挂载在window上，而let和const声明的变量不会。
```
var name = 'dyx';
let name1 = 'dyx1';
const name2 = 'dyx2';
console.log(window.name);  // dyx
console.log(window.name1); // undefined
console.log(window.name2); // undefined
```
### var声明变量存在变量提升，let和const不存在变量提升。
```
console.log(name); // undefined 
var name = 'dyx';

console.log(name1); //  Cannot access 'name1' before initialization
let name1 = 'dyx1';

console.log(name2); //  Cannot access 'name2' before initialization
const name2 = 'dyx2';
```
### let和const声明形成块级作用域。
```
if (true) {
  var name = 'dyx';
  let name1 = 'dyx1';
  const name2 = 'dyx2';
}
console.log(name); // dyx 
console.log(name1); // name1 is not defined
console.log(name2); // name2 is not defined 
```
### 同一作用域下let和const不能声明同名变量，而var可以。
```
var name = 'dyx';
var name = 'dyx1';
let name1 = 'dyx2';
let name1 = 'dyx3'; // name1 has already been declared
const name2 = 'dyx4';
const name2 = 'dyx5'; // name2 has already been declared
```
### 暂时性死区。
```
var name = 'dyx';

if (true) {
  // let创建的name变量创建过程被提升了，但是初始化没有提升。变量未初始化或赋值前不允许访问。
  name = 'douyaxing'; // Cannot access 'name' before initialization
  let name = 'dyxweb';
}
```
### const一旦声明必须赋值，声明后不能再修改，如果声明的是复合类型数据，可以修改其属性。
```
const name = 'dyx';
name = 'dyx1'; // Assignment to constant variable

const info = {
  name: 'dyx',
}
info.name = 'douyaxing';
console.log(info); // { name: 'douyaxing' }
```
### 暂时性死区的原因
- 变量的赋值可以分为三个阶段：
   1. 创建变量，在内存中开辟空间。
   2. 初始化变量，将变量初始化为undefined。
   3. 真正赋值。
- let 的「创建」过程被提升了，但是初始化没有提升。存在暂时死区，在变量未初始化或赋值前不允许访问。
- var 的「创建」和「初始化」都被提升了。
- function 的「创建」「初始化」和「赋值」都被提升了。
### let关键字
- 块级作用域
> 使用let声明的变量具有块级作用域，即它们只在声明该变量的花括号{}内部可见和访问。这与使用var声明的变量具有函数作用域(Function Scope)的行为不同。

- 暂时性死区
> 在变量声明之前使用let声明的变量会进入暂时性死区，此时访问该变量会抛出ReferenceError。这与使用var声明的变量在未初始化前默认值为undefined的行为不同。

- 无变量提升
> let声明的变量不会像var一样被提升到作用域顶部，意味着在声明之前无法访问let声明的变量。

- 不允许重复声明
> 在同一作用域内，使用let声明的变量不允许被重复声明，而var则可以在同一作用域内重复声明同名变量而不会报错。

### const关键字
> let关键字的特性const关键字都有，唯一的区别就是const被赋初值以后无法修改。

### let和const对比var的优势
> ES6中的let和const相比var提供了更加清晰和严格的变量管理机制，有助于编写更加健壮和可维护的JavaScript代码。这些改进使得JavaScript的变量声明和作用域行为更加符合开发者的预期，减少了一些常见的错误。

1. 作用域管理更加清晰和直观
    - var声明的变量具有函数作用域或全局作用域，这可能会导致意料之外的变量污染和泄露。
    - let和const声明的变量具有块级作用域，限定在它们所在的花括号{}内部，使得变量的作用域更加明确和可控。
2. 避免变量提升问题
    - var声明的变量会被提升到作用域顶部，这可能会导致意料之外的行为。
    - let和const声明的变量不会被提升，必须在声明之后才能访问，避免了这种问题。
3. 引入暂时性死区
    - let和const声明的变量在声明之前会进入暂时性死区，访问会抛出ReferenceError，这有助于避免一些隐藏的bug。
    - var声明的变量在未初始化前默认值为undefined,可能会导致一些隐藏的错误。
4. 支持常量声明
    - const关键字允许声明不可变的常量变量，有助于增强代码的可读性和稳定性。
    - var无法直接声明常量。
5. 不允许重复声明
    - let和const不允许在同一作用域内重复声明同名变量，有利于避免一些错误。
    - var则可以在同一作用域内重复声明同名变量而不会报错。
