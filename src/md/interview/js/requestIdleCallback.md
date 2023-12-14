## [requestIdleCallback](https://juejin.cn/post/7221793823705268284)
- requestIdleCallback()方法传入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件如动画和输入响应。
- 传如函数一般会按先进先调用的顺序执行，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。如果指定了超时时间，会在超时后的下一帧强制执行。
- 建议为必要的工作设置timeout选项，否则在回调触发之前可能已经过去了很多秒。
- 可以在空闲回调函数中调用requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调。
- 对于长时间任务的优化首先考虑的是Web Worker使其不占用主线程，如果需要操作DOM可以使用requestIdleCallback将长时间任务进行拆分，保证这些任务只在空闲时间执行。每次执行下一个任务的时候，先检查一下当前页面是否该渲染下一帧了，这时会把主线程让出来让页面进行渲染。
```
const id = window.requestIdleCallback((deadline) => {
  // 当前帧剩余时间大于0，或任务已超时
  if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
    // do something
    console.log(1)
  }
}, { timeout: 2000 }) // 指定超时时间
```
### requestIdleCallback在Event Loop的执行流程
![requestIdleCallback执行](./img/requestIdleCallback%E6%89%A7%E8%A1%8C.png)
![requestIdleCallback渲染](./img/requestIdleCallback%E6%B8%B2%E6%9F%93.png)
### 模拟requestIdleCallback
- requestIdleCallback兼容性不够好，Safari完全不支持。
- 可以使用requestAnimationFrame和MessageChannel来模拟实现一个requestIdleCallback。
- requestAnimationFrame在每一帧开始渲染前执行，当帧开始渲染前标记开始时间(start)，并使用MessageChannel创建一个宏任务，根据上面的Event Loop执行流程，渲染完毕后会执行刚才创建出的宏任务，这时在宏任务中判断当前帧渲染耗费的时间(current - start)，判断渲染耗时是否小于16.7ms(current - start < 16.7)，来判断当前是否是空闲时间。
- setTimeout即使指定时间为0浏览器实际也会延时几毫秒后才执行(chrome大概为4ms)，因此使用MessageChannel而不是setTimeout来创建宏任务。
![requestAnimationFrame执行](./img/requestAnimationFrame%E6%89%A7%E8%A1%8C.png)
