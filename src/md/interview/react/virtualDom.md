## 虚拟DOM
> 原生的JavaScript我们直接对DOM进行创建和更改，而React会先将代码转换成一个JavaScript对象，然后这个JavaScript对象再转换成真实DOM。这个JavaScript对象就是所谓的虚拟DOM。当需要创建或更新元素时，React首先会让这个VitrualDom对象进行创建和更改，然后再将VitrualDom对象渲染成真实DOM。

### 优点
- 提高开发效率
> 使用JavaScript，我们很大的关注点在于如何更新DOM。使用React，不必自己去完成属性操作、事件处理、DOM更新，React会替你完成这一切。我们可以更关注我们的业务逻辑而非DOM操作，可大大提升我们的开发效率。

- 性能提升
> 直接操作DOM是非常耗费性能的，但是React使用VitrualDom也是无法避免操作DOM的。如果是首次渲染，VitrualDom不具有优势，甚至它要进行更多的计算，消耗更多的内存。VitrualDom的优势在于React的Diff算法和批处理策略，在重复渲染时帮助我们计算如何更高效的更新。

- 事件机制跨浏览器兼容
> React基于VitrualDom自己实现了一套自己的事件机制，自己模拟了事件冒泡和捕获的过程，采用了事件代理，批量更新等方法，抹平了各个浏览器的事件兼容性问题。

- 跨平台兼容
> 根以React Native为例子，根据VitrualDom画出相应平台的ui层。

### 组件渲染流程
1. JSX只是为createElement方法提供的语法糖,所有的JSX代码最后都会转换成createElement(...)，Babel帮助我们完成了这个转换的过程。在编译时会判断JSX中组件的首字母，当首字母为小写时，其被认定为原生DOM标签，createElement的第一个变量被编译为字符串；当首字母为大写时，其被认定为自定义组件，createElement的第一个变量被编译为对象。
2. createElement函数对key和ref等特殊的props进行处理，并获取defaultProps对默认props进行赋值，并且对传入的子节点进行处理，最终构造成一个ReactElement对象(虚拟DOM)。
3. ReactDOM.render将生成好的虚拟DOM渲染到指定容器上，最终转换为真实DOM。

**由于JSX提前要被Babel编译，所以JSX是不能在运行时动态选择类型的**
```
// 错误
function App(props) {
  return <components[props.type] data={props.data} />;
}


// 正确
function App(props) {
  // Correct! JSX type can be a capitalized variable.
  const CurrenCom = components[props.type];
  return <CurrenCom data={props.data} />;
}
```
