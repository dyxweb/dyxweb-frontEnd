## [Array](https://mp.weixin.qq.com/s/lTpFXhII7LitooRamMbLIA)
### every
> every 方法为数组中的每个元素执行一次 callback 函数，直到它找到一个会使 callback 返回 false 的元素。如果发现了一个这样的元素，every 方法将会立即返回 false，不再继续循环下去。否则，callback 为每一个元素返回 true，every 就会返回 true。空数组使用every永远返回true。

```
// 只会console一个1，因为every方法中的函数没有返回值，默认返回undefined，理解为false，所以执行一次之后就会终止循环
[1,2,3].every(item => {
  console.log(1);
}) // false

// console两个1，因为运行到2时return的false，所以不会继续运行下去
[1,2,3].every(item => {
  console.log(1);
  return item < 2;
}) // false
```
### some
> some 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个true（即可转换为布尔值 true 的值）。如果找到了这样一个值，some() 将会立即返回 true,不再往下执行。否则将返回false。空数组使用some永远返回false。

```
// 会console三个1，因为some方法中的函数没有返回值，默认返回undefined，理解为false，所以会一直执行下去
[1,2,3].some(item => {
  console.log(1);
}) // false

// console一个1，因为运行到1时return的true，所以不会继续运行下去
[1,2,3].some(item => {
  console.log(1);
  return item < 2;
})  // true
```
### Array.from()
> 用于将类对象或具有length属性的对象转为真正的数组,类数组的对象和可遍历的对象（ES6的Set和Map）。也可以将字符串逐个解析生成数组。

```
Array.from('dyx') // ["d","y","x"]
let arrayLike = {
 '0': 'a',
 '1': 'b',
 '2': 'c',
 length: 3
};
// ES5的写法
var arr1 = Array.prototype.slice.call(arrayLike); // ['a', 'b', 'c']
// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
 return p.textContent.length > 100;
});
// arguments对象
function foo() {
 var args = Array.from(arguments);
 // ...
}
```
### find
> 查找数组中第一个符合规则的元素，如果没有找到返回undefined

```
const arr = [1, 2, 3];
arr.find(item => item > 1) // 2
arr.find(item => item > 3) // undefined
``` 
### slice
> 根据规则截取数组，不会改变原数组，返回截取后的数组

```
const arr = [1, 2, 3, 4, 5];
arr.slice(2, 4) // [3, 4]
arr.slice(0, -2) // [1, 2, 3] 截取直倒数第二位
```
### forEach
> forEach没有办法使用continue和break语句，可以使用return来实现continue的效果，想要实现break效果可以使用try catch 来实现对应效果

### Array.isArray()
> 判断是否为数组类型

### fill
> 使用一个固定值填充或替换数组的元素。

```
new Array(5).fill('dyx');
```
### flat
> 将一个多维数组进行压平处理,默认使用一次只有一次压平处理

```
const arr = [1, [2, [3, 4] ] ];
console.log(arr.flat()); // [1, 2, [3, 4]]
console.log(arr.flat().flat()); // [1, 2, 3, 4]
console.log(arr.flat(Infinity)); // [1, 2, 3, 4]
```
### flatMap
```
[1, 2].flatMap(item => [item, item + 1]) // [1, 2, 2, 3]
```
### reduce, reduceRight
> 可以使用该方法实现数组的递归，

- 没有初始值时该方法的第一次迭代发生在数组第二项，方法的第一个参数是第一项，第二个参数是第二项
- 有初始值时该方法的第一次迭代发生在数组第一项，方法的第一个参数是初始值，第二个参数是第一项
- 空数组使用reduce必须有初始值否则会报错

```
// prev代表后面的初始值-1，或者每一次循环后返回的值，current代表当前循环的值
console.log([1,2,3].reduce(
  (prev, current) => {
    console.log(prev, current); 
    return Math.max(prev,current);
  }, -1));

// 数组连接
var newArr = [[0, 1], [2, 3], [4, 5]].reduce((a, b) => {
  return a.concat(b);
});
// [0, 1, 2, 3, 4, 5]

// 同一个数组有无初始值循环的次数不同
const a = [1,2,3].reduce((prev, current) => {
  console.log(prev, current);
  return prev + current
}); // 1 2; 3 3;
console.log(a)  // 6

const a = [1,2,3].reduce((prev, current) => {
  console.log(prev, current);
  return prev + current
}, 0); // 0 1; 1 2; 3 3;
console.log(a)  // 6

const a = [].reduce((prev, current) => {
  console.log(prev, current);
  return prev + current
}, 0); // 没有console，空数组必须有初始值否则报错
console.log(a)  // 0
```
### 数组去重
> 利用set去重没有将空对象去除，利用indexOf没有将空对象和NaN去除，使用对象属性不能相同去重可以完美去重。

#### set
> 利用set简单实现数组去重,去完之后不是数组要注意

```
const item = new Set([1, 2, 3, 1]) // 去重
const arr = Array.from(item) // 重新转为数组

const item = new Set([1, 2, 3, 1]) // 去重
const arr = [...item] // 重新转为数组
```
#### 对象属性不能相同去重
```
const unique = arr => {
  let newArr = [];
  let obj = {};
  for(var i = 0; i < arr.length; i++) {
    if(!obj[arr[i]]) {
      newArr.push(arr[i])
      obj[arr[i]] = 1;
    } else {
      obj[arr[i]]++;
    }
  }
  return newArr;
}
```
#### indexOf去重
```
const unique = arr => {
  var newArr = [];
  for(var i in arr){
    if(newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
```
```
const unique = arr => {
  var len = arr.length;
  var newArr = [];
  for(i = 0; i < len; i++) {
    for(j = i + 1; j < len; j++){
      if(arr[i] === arr[j]){
        j = ++i; // 先找到第一个后面没有重复的值，最外层循环不是循环了数组的长度的次数，而是循环了去重之后数组长度的次数
      }
    }
    newArr.push(arr[i]);
  }
  return newArr; 
}
```
### 数组排序
#### 冒泡排序
```
// 相邻元素的比较
const sort = arr => {
  for(var i = 0; i < arr.length; i++){
    for(j = i; j < arr.length; j++){
      if(arr[i] < arr[j]){ // 大于小于号决定数组排序的规则
        var oo;
        oo = arr[j];
        arr[j] = arr[i];
        arr[i] = oo;
      }
    }
  }
  return arr;
}
```
#### 选择排序
```
// 寻找最小(大)的值然后进行排序
const sort = arr => {
  const len = arr.length;
  var minIndex, temp;
  for (var i = 0; i < len - 1; i++) {
	  minIndex = i;
	  for (var j = i + 1; j < len; j++) {
	    if (arr[j] < arr[minIndex]) { // 寻找最小的数
		    minIndex = j; // 将最小数的索引保存
	    }
	  }
	  temp = arr[i];
	  arr[i] = arr[minIndex];
	  arr[minIndex] = temp;
  }
  return arr;
}
```
### 数组最大最小值
```
for(var i = 0; i < arr.length; i++) {
  if(amin > arr[i]) {
    amin = arr[i];
  }
  if(amax < arr[i]) {
    amax = arr[i];
  }
}
console.log(`最小值：${amin} 最大值：${amax}`);
```
### 数组最大值
```
const arr = [1, 2, 4, 6, 3, 4]
const max = arr.reduce((x, y) => x > y ? x : y);
const max = arr.reduce((x, y) => Math.max(x, y));
```
### 数组最小值
```
const arr = [1, 2, 2, 4, 6, 3, 4]
const min = arr.reduce((x, y) => x > y ? y : x);
const min = arr.reduce((x, y) => Math.min(x, y));
```
### 将数组某一元素全部放在数组前面
```
const arr = ['*','黄','红','白','红','*','白','*','黄','*','红','*','黄','白'];
for (let i in arr){
  if(arr[i] === '*'){
    arr.splice(i, 1)
    arr.unshift('*')
  }
}
```
### 两个有序的数组组成一个有序的数组
```
const a = [1, 3, 5, 7];
const b = [2, 4, 6, 8];
let i = 0;
let j = 0;
let al = a.length;
let bl = b.length;
let c = []; // 新的数组
while (i < al || j < bl) {
  if (a[i] <= b[j]) {
    c.push(a[i]);
    i++
  } else {
    c.push(b[j]);
    j++
  }
}
```