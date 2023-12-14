## PureComponent比较逻辑
- PrueComponent继承了Component将shouldComponentUpdate重写成了shallowCompare。
- 在shallowCompare中使用shallowEqual方法对新旧Props和新旧State进行浅比较。
```
export defualut function PureComponent(props, context) {
  Component.call(this, props, context);
}
PureComponent.prototype = Object.create(Component.prototye);
PureComponent.prototype.contructor = PureComponent;
PureComponent.prototype.shouldComponentUpdate = shallowCompare;
 
function shallowCompare(nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
}
```
### shallowEqual的比较步骤
1. 首先会直接比较新老Props和新老State两个对象的地址是否相同，如果地址相同，就直接返回true，如果地址不相同就继续判断。
2. 判断新老Props和新老State，有不是对象或者为null的，返回false。
3. 判断新老Props和新老State的属性个数(Object.keys)是否相同，如果不同证明有属性增加或者减少，返回false。
4. 遍历老Props和老State的每一项，如果对应的新Props或新State中有没有与之对应的属性或对应的属性值不相等(浅比较)，返回false。
```
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }
 
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
 
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
 
  if (keysA.length !== keysB.length) {
    return false;
  }
 
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
 
  return true;
}
```