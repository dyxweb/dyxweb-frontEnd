## setState
> setState本身并不是异步的，而是如果在调用setState时，如果react正处于更新过程，当前更新会被暂存，等上一次更新执行后在执行，这个过程给人一种异步的假象。在react的生命周期和合成事件中，react仍然处于他的更新机制中，这时isBatchingUpdates为true。这时无论调用多少次setState，都不会立即执行更新，而是将要更新的state存入_pendingStateQueue，将要更新的组件存入dirtyComponent。当上一次更新机制执行完毕后会将isBatchingUpdates设置为false。这时将执行之前累积的setState。

- 钩子函数和React合成事件中的setState是异步的
- 异步函数和原生事件中的setstate是同步的