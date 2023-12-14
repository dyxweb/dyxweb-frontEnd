### [react中使用Immutable Data](https://juejin.cn/post/6976798974757830687)
- React父组件更新会引起子组件重新render，当我们传入组件的props和state只有一层时，我们可以直接使用React.PureComponent，它会自动帮我们进行浅比较，从而控制shouldComponentUpdate的返回值。当传入的props或state不止一层，或者传入的是Array和Object类型时，浅比较就失效了。当然我们也可以在 shouldComponentUpdate()中使用使用deepCopy和deepCompare来避免不必要的render()，但deepCopy和deepCompare一般都是非常耗性能的。这个时候我们就需要 Immutable Data。
### 在react中使用Immutable Data的好处
- 修改引用类型数据，当属性值没有变化时不会生成新的引用，组件不会重新渲染，减少不必要的渲染。
- 判断组件是否要更新时，对于引用类型数据比较不再需要深比较，提升性能。
- 操作引用类型数据，不需要再浅拷贝或者深拷贝，提升性能。
- 操作引用类型数据，简化修改引用类型数据的写法，尤其数据层次比较深的情况。
### PureComponent(React.memo)进行浅比较
- 当引用类型数据的属性值变化，但是引用没有变化时，浅比较无法识别变化，导致不更新。
- 当引用类型数据的属性值没有变化，但是引用变化时，浅比较会识别出变化，导致多余更新。
### shouldComponentUpdate中进行深比较
- 把引用类型数据的所有属性和值进行递归比较，当引用类型数据层次比较复杂时比较浪费性能。
### Immutable Data + PureComponent(React.memo)浅比较
- 使用Immutable Data凡是有节点被改变，那么它和与它相关的所有上级节点都更新，并且更新后返回了一个全新的引用，即使是浅比对也能感知到数据的改变。
### 使用immer减少因为引用类型数据的引用变化但是数据值没有变化造成的重复render
- 每一次触发change方法组件都会重新render，因为每一次触发change方法即使age没有变化也都生成了一个新的对象。
```
const [data, setData] = useState({
  name: 'dyx',
  info: { age: 26 }
});
const change = () => {
  const newData = { ...data, info: { ...data.info, age: 27 }};
  setData(newData);
}
```
- 使用immer后只有age变化时才会生成新的对象，组件才会重新render。
```
import produce from 'immer';

const [data, setData] = useState({
  name: 'dyx',
  info: { age: 26 }
});
const change = () => {
  const newData = produce(data, draft => {
    draft.info.age = 27;
  });
  setData(newData);
}
```
### 在shouldComponentUpdate中判断组件是否需要更新不再需要deepCompare，只需要使用===判断即可，相较于deepCompare可以极大提高性能。
```
shouldComponentUpdate(nextProps = {}, nextState = {}) {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
    Object.keys(thisState).length !== Object.keys(nextState).length
  ) {
    return true;
  }

  for (const key in nextProps) {
    if (thisProps[key] !== nextProps[key]) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key]) {
      return true;
    }
  }
  return false;
}
```