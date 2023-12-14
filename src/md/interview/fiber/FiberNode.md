## FiberNode
### FiberNode包含的三层含义
- 架构层面：v15的Reconciler采用递归的方式执行，被称为Stack Reconciler。v16及以后版本的Reconciler基于FiberNode实现，被称为Fiber Reconciler。
- 静态的数据结构层面：每个FiberNode对应一个React元素，用于保存React元素的类型、对应的DOM元素等信息。
- 动态的工作单元层面：每个FiberNode用于保存本次更新中该React元素变化的数据、要执行的工作(增、删、改、更新Ref、副作用等)。
### FiberNode构造函数
- FiberNode作为一个构造函数，FiberNode中包含很多属性。
```
function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;
}
```
### 架构层面
- Fiber架构是由多个FiberNode组成的树状结构，FiberNode之间由如下属性连接。
- 指向父FiberNode使用return字段：作为一个工作单元，return指FiberNode执行完completeWork后返回的下一个FiberNode。子FiberNode及其兄弟FiberNode执行完completeWork后会返回父FiberNode，所以return用来指代父FiberNode。
```
// 指向父FiberNode 
this.return = null;

// 指向第一个子FiberNode 
this.child = null;

// 指向右边的兄弟FiberNode 
this.sibling = null;
```
### 静态的数据结构层面
> FiberNode中保存了从React元素中获取的信息。

- stateNode：与Fiber节点相关的组件、DOM节点或其他React元素类型的类实例的引用。
- type：定义Fiber节点与什么元素有关。
- tag：定义了Fiber的类型，在调和算法中根据类型来确定需要做什么工作。
- key：用于定义在一组Fiber节点中的唯一标识。
- updateQueue：状态更新、回调和DOM更新的队列。
- memoizedState：反映current Fiber的state。
- memoizedProps：反映current Fiber的props。
- pendingProps：反映workInProgress Fiber的props。
### 动态的工作单元层面
- FiberNode中保存了更新相关的信息，例如本次更新将在Renderer(Commit阶段)中执行的相关操作数据。
```
// 更新操作相关数据
this.flags = NoFlags; 
this.subtreeFlags = NoFlags; 
this.deletions = null;

// 优先级调度相关数据
this.lanes = NoLanes; 
this.childLanes = NoLanes;

// Fiber架构的工作原理相关数据
this.alternate = null;
```