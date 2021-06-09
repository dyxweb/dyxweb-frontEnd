## Promise
### Promise
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