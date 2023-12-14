## react中使用Web Worker
### new URL()方式
- vite/webpack都支持
```
const myWorker = new Worker(
  new URL('./worker.js', import.meta.url)
);
```
### import方式
- 只有vite支持
```
import worker from './worker?worker';

const myWorker = new worker();
```
### useworker库
- 向useWorker传递回调函数，该回调函数会在对应的Web Worker中执行。
- 安装依赖
```
// useworker源码中使用peerDependencies指定了React版本为^16.8.0。在17/18版本的React环境下会发生错误。可以使用--force忽略版本限制
npm  install @koale/useworker --force
```
- 使用
```
const sortNumbers = numbers => ([...numbers].sort());

const [
  sortWorker, 
  { 
    status: sortStatus, 
    kill: killSortWorker 
  }
] = useWorker(sortNumbers);
```
### 通过引入文件路径实例化Worker对象
- index.js
```
// 创建一个新的Worker对象，指定要在Worker线程中执行的脚本文件路径
const myWorker = new Worker(
  new URL('./worker.js', import.meta.url)
);

// 向Worker发送消息
myWorker.postMessage(123);

// 监听来自Worker的消息
myWorker.onmessage = function(event) {
  console.log("来自worker的消息: ", event.data);
};
```
- worker.js
```
// 在Worker脚本中接收并处理消息
self.onmessage = function(event) {
  console.log("来自主线程的消息: ", event.data);
  // 执行一些计算密集型的任务
  const result = doSomeHeavyTask(event.data);
  // 将结果发送回主线程
  self.postMessage(result);
};
```
### 通过Blob方式实例化Worker对象
- 使用Blob构建方式生成Web Worker更灵活、便捷和安全。
- index.js
```
// 定义要在Worker中执行的脚本内容
const workerScript = `
  self.onmessage = function(event) {
    console.log("来自主线程的消息: ", event.data);
    // 执行一些计算密集型的任务
    const result = doSomeHeavyTask(event.data);
    // 将结果发送回主线程
    self.postMessage(result);
  };
`;

// 创建一个Blob对象，指定脚本内容和类型
const blob = new Blob(
  [workerScript], 
  { type: 'application/javascript' }
);

// 使用URL.createObjectURL()方法创建一个URL，用于生成Worker
const blobURL = URL.createObjectURL(blob);

// 生成一个新的Worker
const myWorker = new Worker(blobURL);

// 向Worker发送消息
worker.postMessage(123);

// 监听来自Worker的消息
myWorker.onmessage = function(event) {
  console.log("来自worker的消息: ", event.data);
};
```
