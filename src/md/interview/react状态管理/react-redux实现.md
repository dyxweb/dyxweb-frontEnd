## react-redux
###  Provider实现
> Provider将store放进this.context里，就能在组件中通过this.context.store这样的形式取到store，不需要再单独import store。同时也用于connect方法中更好的直接使用store。

```
import React from 'react'
import PropTypes from 'prop-types'

export class Provider extends React.Component {  
  // 需要声明静态属性childContextTypes来指定context对象的属性,是context的固定写法  
  static childContextTypes = {    
    store: PropTypes.object  
  } 

  // 实现getChildContext方法,返回context对象,也是固定写法  
  getChildContext() {    
    return { store: this.store }  
  }  

  constructor(props, context) {    
    super(props, context)    
    this.store = props.store  
  }  

  // 渲染被Provider包裹的组件  
  render() {    
    return this.props.children  
  }
}
```
### Connect实现
> connect接收mapStateToProps、mapDispatchToProps两个方法，然后返回一个高阶函数，这个高阶函数接收一个组件，返回一个高阶组件(其实就是给传入的组件增加一些属性和功能)，connect根据传入的map，将state和dispatch(action)挂载子组件的props上。其实context不过是给connect提供了获取store的途径，我们在connect中直接import store完全可以取代context。那么Provider存在的意义是什么，上面这个connect是自己写的，可以直接import store，但react-redux的connect是封装的，对外只提供api，所以需要让Provider传入store。

```
export function connect(mapStateToProps, mapDispatchToProps) {    
  return function(Component) {      
    class Connect extends React.Component {        
      componentDidMount() {          
        // 从context获取store并订阅更新          
        this.context.store.subscribe(this.handleStoreChange.bind(this));        
      }       
      handleStoreChange() {          
        // 触发更新          
        // 触发的方法有多种,这里为了简洁起见,直接forceUpdate强制更新,读者也可以通过setState来触发子组件更新          
        this.forceUpdate()        
      }        
      render() {          
        return (            
          <Component              
            // 传入该组件的props,需要由connect这个高阶组件原样传回原组件              
            { ...this.props }              
            // 根据mapStateToProps把state挂到this.props上              
            { ...mapStateToProps(this.context.store.getState()) }               
            // 根据mapDispatchToProps把dispatch(action)挂到this.props上              
            { ...mapDispatchToProps(this.context.store.dispatch) }                 
          />              
        )        
      }      
    }      
    //接收context的固定写法      
    Connect.contextTypes = {        
      store: PropTypes.object      
    }      
    return Connect    
  }
}
```