## [redux](https://juejin.cn/post/6844904036013965325)
- Redux遵循“单向数据流”和“不可变状态模型”的设计思想。
- 这使得Redux的状态变化是可预测、可调试的。
### 页面映射redux状态后页面更新机制
- 页面映射redux中store某个状态时，只有当这个状态变化页面才会重新render，其它没有映射的状态变化不会导致页面重新render。
- 注意页面映射状态(connect、useSelector)的范围，映射粒度要小，不要将整个store映射到页面上(即使页面只使用了其中的一部分状态)，只映射需要的状态。
### 异步状态更新
- redux执行action是同步的，但是reducer中将新状态返回更新store数据仓库的过程是异步的。
- 组件通过react-redux封装后相当于包了一层高阶组件。而这一个高阶组件在redux里的state更新时会调用setState，所以redux的store的数据仓库更新才会有异步更新的现象。
### 工作流程
- 用户在view层触发某个事件，通过dispatch发送了action和payload。
- action和payload被传入reducer函数，返回一个新的state。
- store拿到reducer返回的state并做更新，同时通知view层进行re-render。
### 三大要素
- 单一数据源，state存储在唯一的store中。
- state是只读的，唯一改变state的方法是dispatch action，action是一个用于描述已发生事件的普通对象。
- 纯函数修改，通过reducer纯函数修改状态，它接收之前的state和action，并返回新的state。一定要返回一个新的对象，而不是修改之前的state。
### reducer为什么要返回一个新的对象
- redux源码中会比较传入的state和reducer修改之后的state，如果相同则返回旧的对象，如果不同则返回新的对象。
- 比较两个javascript对象中所有的属性是否完全相同，唯一的办法就是深比较，深比较在真实的应用中代码是非常大的，非常耗性能的，需要比较的次数特别多，所以一个有效的解决方案就是做一个规定，当无论发生任何变化时开发者都要返回一个新的对象，没有变化时开发者返回旧的对象，这样直接比较对象的存储地址即可以。
```
for (let i = 0; i < finalReducerKeys.length; i++) {
  const key = finalReducerKeys[i]
  const reducer = finalReducers[key]
  const previousStateForKey = state[key]
  const nextStateForKey = reducer(previousStateForKey, action)
  if (typeof nextStateForKey === 'undefined') {
    const errorMessage = getUndefinedStateErrorMessage(key, action)
    throw new Error(errorMessage)
  }
  nextState[key] = nextStateForKey
  hasChanged = hasChanged || nextStateForKey !== previousStateForKey
}
return hasChanged ? nextState : state
```

