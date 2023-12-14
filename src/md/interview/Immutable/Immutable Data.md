## Immutable Data
### JavaScript中的对象是可变的
- JavaScript中的对象一般是可变的(Mutable)，因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。
- 引用赋值可以节约内存，但当应用复杂后这就造成了非常大的隐患，Mutable带来的优点变得得不偿失。
- 为了解决Mutable带来的隐患，一般的做法是使用shallowCopy(浅拷贝)或deepCopy(深拷贝)来避免原始对象被修改，但这样做造成了CPU和内存的浪费。
- Immutable Data可以很好的解决JavaScript中对象是可变带来的问题。
### Immutable Data
- Immutable Data是一种一旦创建就不能再被更改的数据，对Immutable Data的任何修改或添加删除操作都会返回一个新的Immutable Data。
- 主要原理是采用Persistent Data Structure(持久化数据结构)，当每次修改后我们都会得到一个新的版本，且旧版本可以完好保留。
- 使用旧数据创建新数据时可以保证旧数据同时可用且不变。同时为了避免deepCopy把所有节点都复制一遍带来的性能损耗，Immutable Data使用了Structural Sharing(结构共享)，对于本次操作没有修改的部分会直接共享避免内存浪费。
- Immutable Data内部采用是多叉树的结构，凡是有节点被改变，那么它和与它相关的所有上级节点都更新，并且更新后返回了一个全新的引用，即使是浅比对也能感知到数据的改变。
### Immutable Data优点
- 降低复杂度，避免多个变量指向同一个内存地址引发不可控的副作用。
```
// 如果不查看fn的代码是不能确定打印的结果的，因为不确定它对data做了什么。但如果data是Immutable Data的，是可以确定打印的结果是value。
function andLog(fn) {
  let data = { key: 'value' };
  fn(data);
  console.log(data.key);
}
```
- 节省内存，Immutable Data采用了结构共享机制，所以会尽量复用内存。
```
// a和b共享了没有变化的info节点
import { produce } from 'immer';
const a = {
  name: 'dyx',
  info: { age: 26 }
}
const b = produce(a, draft => {
  draft.name = 'douyaxing';
});

a === b; // false
a.info === b.info; // true
```
- 方便回溯，Immutable Data每次修改都会创建一个新对象，那么变更的记录就能够被保存下来，应用的状态变得可控、可追溯，方便撤销和重做功能的实现。
- 函数式编程，Immutable本身就是函数式编程中的概念，纯函数式编程比面向对象更适用于前端开发。因为只要输入一致，输出必然一致，这样开发的组件更易于调试和组装。