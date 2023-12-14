## workloop(react-dom.development.js)
- performConcurrentWorkOnRoot
- renderRootSync、renderRootConcurrent(shouldTimeSlice判断)
- workLoopSync、workLoopConcurrent(取决于上一步调用的方法)，根据是否有workInProgress节点，调用performUnitOfWork方法
- performUnitOfWork (performUnitOfWork和completeUnitOfWork主要用于迭代，主要操作发生在beginWork和completeWork函数中)
  - beginWork(返回一个指向循环中要处理的下一个子Fiber节点或null) 生成下一个需要处理的子Fiber节点赋值给workInProgress节点，如果没有子节点，React认为它到达了分支的末尾，因此可以完成当前节点。
  - completeUnitOfWork 没有子Fiber节点时完成当前节点后，对兄弟节点执行处理，然后回溯到父节点，兄弟 => 父 => 父兄弟 => 父  ▪▪▪▪▪▪ => FiberRootNode。只有从子节点开始的所有分支都完成后，才能执行回溯操作并完成父节点的工作。
    - completeWork (查找需要处理的节点)


- 传给react源码的是react元素(createElement方法返回的对象)
## createRoot
- createRoot
- createContainer
- createFiberRoot
  - new FiberRootNode
  - current = uninitializedFiber

## commit提交阶段
- commitRoot
- commitRootImpl
> 清理可能存在的上一次的useEffect，然后调度本次commit阶段的useEffect，最后重置一些基本信息方便下个更新任务的内容挂载。

  - 先进入while循环调用flushPassiveEffects，Passive标记对应的是useEffect的副作用操作。以及后面还有flushPassiveEffects方法的调用，判断条件是hostRootFiber自身是否有标记useEffect副作用操作或者hostRootFiber的子节点是否有标记useEffect副作用操作。
  - scheduleCallback方法就是去创建一个task生成一个新的宏任务来异步处理副作用，这里处理副作用的方法就是flushPassiveEffects函数。
  - flushPassiveEffect方法就是专门用于页面渲染完成后来执行useEffect的回调，因为commit的渲染是同步执行，所以通过scheduleCallback方法调度后，保证flushPassiveEffect方法一定在本次dom更新完成后执行，而且还得保证本次commit阶段调度的useEffect必须在下一次commit执行之前先执行一次flushPassiveEffects，所以才会在每一次进入commit的时候，先执行一次flushPassiveEffects方法，去完成上一次可能存在的useEffect



- useEffect hooks的执行通过创建一个新的宏任务来保证在dom更新完成后执行，useEffectLayout hooks以及componentDidMount、componentDidUpdate生命周期方法是在Layout阶段执行。


