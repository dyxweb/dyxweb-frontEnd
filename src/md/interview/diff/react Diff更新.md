## react Diff更新
- react在内部使用fiber这种数据结构来作为虚拟dom(react16+)形成fiber tree，它与dom tree一一对应，一次react更新本质是fiber tree结构的更新变化。
- fiber tree结构的更新，其实就是fiber tree的协调(Reconcile)。fiber tree的协调就是调整fiber tree的结构，使其和更新后的jsx结构、dom tree保持一致。
### jsx => 真实dom
- 从jsx生成react element。
> jsx模板通过babel编译为createElement方法，执行createElement方法返回react element。

- 从react element生成fiber tree。
  1. fiber tree中存在三种类型的指针child、sibling、return。其中child指向第一个子节点，sibling指向兄弟节点，return指针指向父节点。
  2. fiber tree采用的深度优先遍历，如果节点有子节点先遍历子节点；子节点遍历结束以后，再遍历兄弟节点；没有子节点和兄弟节点就返回父节点，遍历父节点的兄弟节点；当节点的return指针返回null时，fiber tree的遍历结束。
- 从fiber tree生成真实dom。
> fiber tree生成之后，从fiber tree到真实dom就是处理fiber tree上对应的副作用，包括：

  1. 所有dom节点的新增。
  2. componentDidMount、useEffect的callback函数的触发。
  3. ref引用的初始化。
### 双缓存fiber tree
- react做更新处理时，会同时存在两颗fiber tree。一颗是已经存在的fiber tree，对应当前屏幕显示的内容，称为current fiber tree。另外一颗是更新过程中构建的new fiber tree，称为workInProgress fiber tree。
- current fiber tree和workInProgress fiber tree可以通过alternate指针互相访问。
- 当更新完成以后，使用workInProgress fiber tree替换掉current fiber tree，作为下一次更新的current fiber tree。
### 协调的过程
1. 为workInProgress fiber tree生成fiber node。
2. 为发生变化的fiber node标记副作用effect。
3. 收集带effect的fiber node。
### 生成workInProgress fiber tree的fiber node的方式
1. 克隆(浅拷贝)current fiber node，意味着原来的dom节点可以复用，只需要更新dom节点的属性，或者移动dom节点。
2. 新建一个fiber node，意味着需要新增加一个dom节点。
3. 直接复用current fiber node，表示对应的dom节点完全不用做任何处理。
### 直接复用current fiber node的场景
1. 当子组件的渲染方法(类组件的render、函数组件方法)没有触发(比如使用了React.memo)，没有返回新的react element，子节点就可以直接复用current fiber node。
2. 通过合理使用ShouldComponentUpdate、React.memo，阻止不必要的组件重新render，通过直接复用current fiber node，加快workInProgress fiber tree的协调，达到优化的目的。
### 克隆(浅拷贝)或者新建fiber node的场景
1. 只要组件的渲染方法被触发返回新的react element，那么就需要根据新的react element创建fiber node(通过浅拷贝或新建)。
2. 如果能在current fiber tree中找到匹配节点，那么可以通过克隆(浅拷贝)current fiber node的方式来创建新的节点。
3. 如果无法在current fiber tree中找到匹配节点，那么就需要重新创建一个新的节点。
### Diff算法
- Diff算法比较的双方是用于构建workInProgress fiber tree中的fiber node的react element和current fiber tree中的fiber node。
- 比较两者的key和type，根据比较结果来决定如何为workInProgress fiber tree创建fiber node。
### key和type
- key就是jsx模板中元素上的key属性，如果不写默认为undefined。
- jsx模板转化为react element后，元素的key属性会作为react element的key属性。
- react element转化为fiber node以后，react element的key属性也会作为fiber node的key属性。
- jsx中不同的元素类型，有不同的type。jsx模板转化为react element以后，react element的type属性会根据jsx元素的类型赋不同的值，可能是组件函数，也可能是dom标签字符串，还可能是数字。react element转化为fiber node以后，react element的type属性也会作为fiber node的type属性。
```
<Component name="xxxx" />  // type = Component，是一个函数
<div></div>    // type = "div"，是一个字符串
<React.Fragment></React.Fragment>  // type = React.Fragment，是一个数字(react内部定义的)； 
```
- 综上，判断拷贝current fiber node的逻辑是：
```
reactElement.key === currentFiberNode.key && reactElement.type === currentFiberNode.type // 可以克隆

reactElement.key !== currentFiberNode.key // 不可克隆

reactElement.key === currentFiberNode.key && reactElement.type !== currentFiberNode.type // 不可克隆；
```
### Diff算法流程
- 不跨层级进行比较。
- 通过比较key、type来判断是否需要克隆current fiber node。只有key和type都相等，才克隆current fiber node作为新的节点，否则就需要新建一个节点。key的优先级更高，如果key值不相同，那么节点不可克隆。
- 当比较single react element和current fiber node list时，只需要遍历current fiber node list，比较每个current fiber node和react element的key值和type。只有key和type都相等react element和current fiber node才能匹配。如果有匹配的直接克隆current fiber node，作为react element对应的workInProgress fiber node。如果没有匹配的current fiber node，就需要为react element重新创建一个新的fiber node作为workInProgress fiber node。
- 当比较react element list和current fiber node list时，还需要通过列表下标index判断wokrInProgress fiber node是否相对于克隆的current fiber node发生了移动，这也是Diff中最复杂的地方。
### 为发生变化的fiber node标记effect
> 节点只要是重新创建的而不是克隆自current fiber node，那么节点就百分之百发生了变化需要更新；节点克隆自current fiber node，需要比较props是否发生了变化，如果props发生了变化节点需要更新；节点克隆自current fiber node且是组件类型，还需要比较state是否发生了变化，如果state发生了变化节点需要更新。

- Placement：只针对dom类型的fiber node，表示节点需要做移动或者添加操作。
- Update：针对所有类型的fiber node，表示fiber node需要做更新操作。
- PlacementAndUpdate：只针对dom类型的fiber node，表示节点发生了移动且props发生了变化。
- Ref：表示节点存在ref，需要初始化/更新ref.current。
- Deletion：针对所有类型的fiber node，表示fiber node需要移除。
- Snapshot：主要是针对类组件fiber node。当类组件fiber node发生了mount或者update操作，且定义了getSnapshotBeforeUpdate方法就会标记Snapshot。
- Passive：主要针对函数组件fiber node，表示函数组件使用了useEffect。当函数组件节点发生mount或者update操作，且使用了useEffect hook就会给fiber node标记Passive。
- Layout：主要针对函数组件fiber node，表示函数组件使用了useLayoutEffect。当函数组件节点发生mount或者update操作，且使用了useLayoutEffect hook就会给fiber node标记Layout。
- 一个fiber node可同时标记多个effect。
### 收集带effect的fiber node
- 如果一个fiber node被标记了effect，那么react就会在这个fiber node完成协调以后，将这个fiber node收集到effectList中。当整颗fiber tree完成协调以后，所有被标记effect的fiber node都被收集到一起。
- 收集fiber node的effectList采用单链表结构存储，firstEffect指向第一个标记effect的fiber node，lastEffect标记最后一个fiber node，节点之间通过nextEffect指针连接。
- 由于fiber tree协调时采用的顺序是深度优先，协调完成的顺序是子节点、子节点兄弟节点、父节点，所以收集带effect标记的fiber node时，顺序也是子节点、子节点兄弟节点、父节点。
### Render
> render也称为commit，是对协调过程中标记的effect的处理，effect的处理分为三个阶段，这三个阶段按照从前到后的顺序如下。不同的阶段处理的effect种类也不相同，在每个阶段react都会从effectList链表的头部firstEffect开始，按序遍历fiber node直到lastEffect。

1. before mutation阶段(dom操作之前)
2. mutation阶段(dom操作)
3. layout阶段(dom操作之后)
### before mutation阶段
- before mutation阶段的主要工作是处理带Snapshot标记的fiber node。
- 从firstEffect开始遍历effect列表，如果fiber node带Snapshot标记，触发getSnapshotBeforeUpdate方法。
### mutation阶段
- mutation阶段的主要工作是处理带Deletion、Placement、PlacementAndUpdate、Update标记的fiber node。 
- 在这一阶段涉及到dom节点的更新、新增、移动、删除，组件节点删除导致的componentWillUnmount、useEffect的destory方法的触发，以及删除节点引发的ref引用的重置。
- dom节点的更新。
  1. 通过原生的API setAttribute、removeArrribute修改dom节点的attr。
  2. 直接修改dom节点的style。
  3. 直接修改dom节点的innerHtml、textContent。
- dom节点的新增和移动。
  1. 如果新增(移动)的节点是父节点的最后一个子节点，那么可以直接使用appendChild方法。
  2. 如果不是最后一个节点，需要使用insertBefore方法。通过遍历找到第一个没有带Placement标记的节点作为insertBefore的定位元素。
- dom节点的删除。
  1. 如果节点是dom节点，通过removeChild移除。
  2. 如果节点是组件节点，触发componentWillUnmount、useEffect的destory方法的执行。
  3. 如果标记Deletion的节点的子节点中有组件节点，深度优先遍历子节点，依次触发子节点的componentWillUnmount、useEffect的destory方法的执行。
  4. 如果标记Deletion的节点及子节点关联了ref引用，要将ref引用置空，及ref.current = null(也是深度优先遍历)。
### layout阶段
- layout阶段的主要工作是处理带update标记的组件节点和带ref标记的所有节点。
- 如果类组件节点是mount操作触发componentDidMount；如果是update操作触发componentDidUpdate。
- 如果函数组件节点时mount操作，触发useLayoutEffect的callback；如果是update操作，先触发上一次更新生成的useEffect的destory，再触发这一次的callback。
- 异步调度函数组件的useEffect。
- 如果组件节点关联了ref引用，要初始化ref.current;