## [reactApi](https://juejin.cn/post/6950063294270930980)
### 组件类
#### Component
> 类组件的基础

#### PureComponent
> 会浅比较，props和state是否相同，来决定是否重新渲染组件。所以一般用于性能调优，减少render次数

#### memo
> React.memo只能对props的情况判断确定是否渲染。高阶组件，第一个参数原始组件本身，第二个参数，返回布尔值，true 证明组件无须重新渲染，false证明组件需要重新渲染，这个和类组件中的shouldComponentUpdate()正好相反。

- React.memo: 第二个参数 返回 true 组件不渲染 ， 返回 false 组件重新渲染。
- shouldComponentUpdate: 返回 true 组件渲染 ， 返回 false 组件不渲染。

#### forwardRef
- 想要获取深层次组件(例如孙组件)的dom元素
- 高阶组件，使用ref拿到原始组件的实例

#### lazy + Suspense
> 构建异步渲染组件，两者要配合使用，不支持服务端渲染

- React.lazy 接受一个函数，这个函数需要动态调用 import()。它必须返回一个 Promise ，该 Promise 需要 resolve 一个 default export 的 React 组件。
- Suspense 让组件“等待”某个异步操作，直到该异步操作结束即可渲染

#### Fragment
> react不允许一个组件返回多个节点元素，避免增加额外的dom节点，使用Fragment元素包裹即可

- 相较于<></>形式Fragment可以支持key属性。
- map遍历后的元素，react底层会处理，默认在外部嵌套一个Fragment元素

#### Profiler
> 用于开发阶段，性能检测，检测一次react组件渲染用时，性能开销。第一个参是 id，用于表识唯一性的，第二个参数是onRender回调函数，用于渲染完成，接受渲染参数。

#### StrictMode
> 严格模式，用于检测react项目中的潜在的问题，严格模式检查仅在开发模式下运行；它们不会影响生产构建。

- 识别不安全的生命周期。
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API

### 工具类
#### createElement
> jsx，最终会被 babel，用createElement编译成react元素形式

- 第一个参数如果是组件类型，会传入组件，如果是dom元素类型，传入元素类型的字符串。
- 第二个参数为一个对象，在dom类型中为属性，在组件类型中为props。
- 其他参数为children，根据顺序排列

#### cloneElement
> cloneElement的作用是以 element 元素为样板克隆并返回新的 React 元素。返回新的React元素可以在原基础上添加新的属性。

#### createContext
> createContext用于创建一个Context对象，createContext对象中，包括用于传递 Context 对象值 value的Provider，和接受value变化订阅的Consumer。

#### createFactory
> 返回用于生成指定类型 React 元素的函数，api将要被废弃，如果想要达到同样的效果，可以使用createElement

#### createRef
> createRef可以创建一个 ref 元素，有其它实现方式可以替代

#### isValidElement
> 这个方法可以用来检测是否为react element元素，接受待验证对象，返回true或者false

#### React.Children 提供了用于处理 this.props.children 不透明数据结构的实用方法
> 当children的元素的数据结构使用数组的map等方法不是很适用时，就要使用react.Chidren的方法来处理

- Children.map 遍历并返回新的数组
- Children.forEach 仅遍历
- Children.count children 中的组件总数量
- Children.toArray 返回props.children扁平化后的结果
- Children.only 验证 children 是否只有一个子节点，如果有则返回它，否则此方法会抛出错误。Children.only() 不接受 Children.map() 的返回值，因为它是一个数组而并不是 React 元素

### react-dom
#### render
> 用于渲染一个react元素

#### hydrate
> 服务端渲染使用的方法，用法同render

#### createPortal
> createPortal 可以把当前组件或 element 元素的子节点，渲染到组件之外的其他地方。例如弹窗组件

#### unstable_batchedUpdates
> 正常情况下react的state更新会有一个batch的过程，批量更新state减少渲染次数，当在setTimeout或者promise的then中使用时，不再有此效果，想要依然实现批量更新的效果可以使用unstable_batchedUpdates方法

```
handerClick=()=>{
	Promise.resolve().then(()=>{
		ReactDOM.unstable_batchedUpdates(()=>{
			this.setState({ numer : this.state.numer + 1 })
			console.log(this.state.numer)
			this.setState({ numer : this.state.numer + 1 })
			console.log(this.state.numer)
			this.setState({ numer : this.state.numer + 1 })
			console.log(this.state.numer)
		}) 
	})
}

```
#### flushSync
> 可以将回调函数中的更新任务，放在一个较高的优先级中

```
// 打印 0 3 4 1  因为3设定了一个高优先级的更新，所以3 先被打印，2 4 被批量更新为 4，最后打印1
class Index extends React.Component{
	state={ number: 0 }

	handerClick = () => {
		setTimeout(() => {
			this.setState({ number: 1  })
		})
		this.setState({ number: 2  })
		ReactDOM.flushSync(() => {
			this.setState({ number: 3  })
		})
		this.setState({ number: 4  })
	}

	render(){
		const { number } = this.state
		console.log(number)
		return (<div>
			<div>{ number }</div>
			<button onClick={this.handerClick} >测试flushSync</button>
		</div>)
	}
}
```
#### findDOMNode
> 用于访问组件DOM元素节点，推荐使用ref获取

#### unmountComponentAtNode
> 从 DOM 中卸载组件，会将其事件处理器和 state 一并清除。 如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 true ，如果没有组件可被移除将会返回 false 