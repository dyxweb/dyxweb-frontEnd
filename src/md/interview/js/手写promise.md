## Promise

### 手写Promise
#### 基本功能
1. Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行,执行器会传入内部的resolve和reject方法供调用的时候使用
2. Promise 会有三种状态Pending 等待, Fulfilled 完成, Rejected 失败,状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改
3. Promise 中使用 resolve 和 reject 两个函数来更改状态；
4. then 方法内部做的事情就是状态判断,如果状态是成功，调用成功回调函数, 如果状态是失败，调用失败回调函数

#### Promise处理异步，保证.then的执行等待异步执行完
1. then方法中判断当前的状态，如果是Pending 则缓存成功和失败的回调函数，待状态改变之后在对应的reject或resolve方法中调用对应的回调函数

#### then方法的多次调用实现
1. 如果是Pending 则缓存成功和失败的回调函数，缓存时应该缓存所有的回调函数(数组存储)，状态改变之后调用的时候循环调用存储的回调函数

#### then方法的链式调用
1. then 方法要链式调用那么就需要返回一个 Promise 对象

#### then方法判断是否返回自己
> 如果 then 方法返回的是自己的 Promise 对象，则会发生循环调用，这个时候程序会报错

1. 判断返回的Promise是否等于自己，如果等于自己抛错
2. 判断的过程在Promise的运行过程中，此时无法获取到返回的Promise，所以判断的过程需要创建微任务来处理，保证可以获取到返回的Promise

#### 捕获错误
1. 捕获执行器中的代码，如果执行器中有代码错误(外部调用的语法)，那么 Promise 的状态要变为失败
2. then方法执行时捕获错误

#### then方法的参数可选
> then方法的参数可以不传或者单传都不影响执行

1. then方法的参数进行判断，没有传入参数时执行默认的方法

#### resolve和reject的静态调用
1. 在Promise类中使用static关键字实现resolve和reject方法
2. 方法的内部就是调用new Promise((resolve, reject) => {})
### 实现
```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    
    let resolve = (value) = > {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) = > fn());
      }
    };
      
    let reject = (reason) = > {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) = > fn());
      }
    };
      
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
    
  then(onFulfilled, onRejected) {
    // 解决 onFufilled，onRejected 没有传值的问题
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) = > v;
    // 因为错误的值要让后面访问到，所以这里也要抛出错误，不然会在之后 then 的 resolve 中捕获
    onRejected = typeof onRejected === "function" ? onRejected : (err) = > {
        throw err;
    };

    // 每次调用 then 都返回一个新的 promise,保证可以链式调用
    let promise2 = new Promise((resolve, reject) = > {
      if (this.status === FULFILLED) {
        setTimeout(() = > {
          try {
            let x = onFulfilled(this.value);
            // x可能是一个proimise
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
              reject(e);
          }
        }, 0);
      }
    
      if (this.status === REJECTED) {
        setTimeout(() = > {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() = > {
          setTimeout(() = > {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
    
        this.onRejectedCallbacks.push(() = > {
          setTimeout(() = > {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });  
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}


const resolvePromise = (promise2, x, resolve, reject) = > {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }

  let called;
  if ((typeof x === "object" && x != null) || typeof x === "function") {
    try {
      // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）
      let then = x.then;
      if (typeof then === "function") {
        // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值
        then.call(
          x, (y) = > {
            // 根据 promise 的状态决定是成功还是失败
            if (called) return;
            called = true;
            // 递归解析的过程（因为可能 promise 中还有 promise）
            resolvePromise(promise2, y, resolve, reject);
          }, (r) = > {
            // 只要失败就失败
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4
    resolve(x);
  }
};
```
### Promise.resolve
```
Promise.resolve = function(value) {
  // 如果是 Promsie，则直接输出它
  if(value instanceof Promise){
      return value
  }
  return new Promise(resolve => resolve(value))
}
```
### Promise.reject
> 如果给 Promise.reject() 传递一个 Promise 对象，则这个对象会成为新 Promise 的值。

```
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => reject(reason))
}
```
### Promise.all
```
Promise.all = function(promiseArr) {
  let index = 0, result = []
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        index++
        result[i] = val
        // 全部resolve之后才返回最终的值
        if (index === promiseArr.length) {
          resolve(result)
        }
      }, err => {
        reject(err)
      })
    })
  })
}
```
### Promise.race
```
Promise.race = function(promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach(p => {
      Promise.resolve(p).then(val => {
        // 有一个resolve之后就返回最终的值
        resolve(val)
      }, err => {
        rejecte(err)
      })
    })
  })
}
```
### Promise 并行限制
```
class Scheduler {
  constructor() {
    this.queue = [];
    this.maxCount = 2;
    this.runCounts = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;

    this.queue.shift()().then(() => {
      this.runCounts--;
      this.request();
    });
  }
}
   
const timeout = time => new Promise(resolve => {
  setTimeout(resolve, time);
})
  
const scheduler = new Scheduler();
  
const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}
  
  
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
scheduler.taskStart()
```