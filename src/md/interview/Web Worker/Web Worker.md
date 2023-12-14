## Web Worker
- Web Worker在一个单独的线程中运行任务，这使得JavaScript代码可以在后台执行，不会阻塞任何用户交互。
- Web Worker具有自己的引擎实例和事件循环，它与主线程并行运行，不会阻塞主线程也不会阻塞事件循环。
- Web Worker主要用于在Web浏览器中执行耗时任务，如大量数据处理、CSV导出、图像处理等。
- 创建Worker时JS引擎向浏览器申请开一个子线程(子线程是浏览器开的，完全受主线程控制，而且不能操作DOM)。
- JS引擎线程与Worker线程间通过特定的方式通信(postMessage API，需要通过序列化对象来与线程交互特定的数据)。
- JS引擎是单线程的，这一点的本质仍然未改变，Worker可以理解是浏览器给JS引擎开的外挂，专门用来解决那些大量计算问题。
### Web Worker的限制
- Web Worker没有访问DOM的权限。
- Web Worker在与主线程分离的沙箱环境中运行，对系统资源的访问会受到限制，无法访问window对象和document。
- 当Worker正在运行时法再次调用它，直到它完成或被终止。可以创建多个Worker实例解决这个问题。
- Web Worker会受到终端用户机器可用CPU核心和内存的限制。
- Web Worker无法返回函数，因为响应是序列化的。
### JavaScript执行耗时任务阻塞UI交互
- 将耗时任务分割成多个短任务，并让其在多个渲染帧内执行，给UI交互留有时间。
- 通过回调的方式，在UI交互触发后再进行耗时任务的操作。
- 指定一个优先队列，当高优先级任务被执行时，低优先级任务(耗时任务)被降级处理(冷处理)，直到高优先级任务被执行后再执行剩余低优先级任务(React并发的核心要点)。
- 上述处理方式只是将一些耗时任务从一个渲染帧分割成多个渲染帧或者延后到多个渲染帧内，本质上还是单线程的处理方式。
### Web Worker使用
1. 创建一个新的JavaScript文件，其中包含要运行的代码(耗时任务)。
2. 在主JavaScript文件中，使用Worker构造函数创建一个新的worker对象。此构造函数接收一个参数，即在步骤1中创建的JavaScript文件的URL。
```
const worker = new Worker('worker.js');
```
3. 向worker对象添加事件监听以处理主线程和Web Worker之间发送的消息。onmessage用于处理从Web Worker发送来的消息，postMessage用于向Web Worker发送消息。
```
worker.onmessage = function(event) {
  console.log('Worker: ' + event.data);
};

worker.postMessage('Hello, worker!');
```
4. 在Web Worker的JavaScript文件中，使用self对象的onmessage属性添加事件监听来处理从主线程发来的消息，postMessage用于向主线程发送消息。
```
self.onmessage = function(event) {
  console.log('Main: ' + event.data);
  self.postMessage('Hello, Main!');
};
```
### 终止Web Worker
- 使用terminate()函数来终止。
```
// 主JavaScript文件中终止Web Worker
worker.terminate();
```
- 通过调用self上的close()函数使其自行终止。
```
// Web Worker自行终止
self.close();
```
### 使用onerror函数来处理Web Worker抛出的错误
```
worker.onerror = function(err) {
  console.log("遇到错误")
}
```
### demo
- 不使用Web Worker：点击btn1时，js会进行大量计算，页面无法响应用户操作，点击input不会有任何反应。
- 使用Web Worker：点击btn2时，页面正常响应用户操作，可以正常的对input进行输入操作。开启了一个单独的worker线程来进行js计算，通过postMessage和onmessage进行两个线程间的通信。
```
<button id="btn1">js</button>
<button id="btn2">worker</button>
<input type="text">

const btn1 = document.getElementById('btn1');
btn1.addEventListener('click', function() {
  let total = 1;
  for (let i = 0; i < 5000000000; i++) {
    total += i;
  }
  console.log(total);
})

if (window.Worker) {
  const myWorker = new Worker('./worker.js');
  myWorker.onmessage = function (e) {
    // e.data就是postMessage传递的数据
    console.log('total', e.data);
  };
  const btn2 = document.getElementById('btn2');
  btn2.addEventListener('click', function () {
    myWorker.postMessage('total');
  });
}


// worker.js
self.onmessage = function(e) {
  // e.data就是postMessage传递的数据
  if (e.data === 'total') {
    let total = 1;
    for (let i = 0; i < 5000000000; i++) {
      total += i;
    }
    postMessage(total);
  }
}
```
### Web Worker实现大文件切片上传
> [https://juejin.cn/post/7351300892572745764](https://juejin.cn/post/7351300892572745764)

