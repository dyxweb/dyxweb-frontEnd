## redux实现
### getState的实现
```
export const createStore = () => {    
  let currentState = {}       // 公共状态    
  function getState() {       // getter        
    return currentState    
  }    
  function dispatch() {}      // setter    
  function subscribe() {}     // 发布订阅    
  return { getState, dispatch, subscribe }
}
```
### dispatch实现
```
export const createStore = () => {    
  let currentState = {}    
  function getState() {        
    return currentState    
  }    
  function dispatch(action) {        
    switch (action.type) {            
      case 'plus':            
      currentState = {                 
        ...state,                 
        count: currentState.count + 1            
      }        
    }    
  }    
  function subscribe() {}    
  return { getState, subscribe, dispatch }
}

// reducer抽离
// reducer.js
const initialState = {    
  count: 0
}
export function reducer(state = initialState, action) {    
  switch(action.type) {      
    case 'plus':        
    return {            
      ...state,                    
      count: state.count + 1        
    }      
    case 'subtract':        
    return {            
      ...state,            
      count: state.count - 1        
    }      
    default:        
    return initialState    
  }
}

import { reducer } from './reducer'
export const createStore = (reducer) => {    
  let currentState = {}     
  function getState() {        
    return currentState    
  }    
  function dispatch(action) {         
    currentState = reducer(currentState, action)  
  }    
  function subscribe() {}    
  dispatch({ type: '@@REDUX_INIT' })  // 初始化store数据  
  return { getState, dispatch, subscribe }
}
```
### subscribe实现
```
import { reducer } from './reducer'
export const createStore = (reducer) => {        
  let currentState = {}        
  let observers = []             // 观察者队列        
  function getState() {                
    return currentState        
  }        
  function dispatch(action) {                
    currentState = reducer(currentState, action)                
    observers.forEach(fn => fn())        
  }        
  function subscribe(fn) {                
    observers.push(fn)        
  }        
  dispatch({ type: '@@REDUX_INIT' })  // 初始化store数据        
  return { getState, subscribe, dispatch }
}
```