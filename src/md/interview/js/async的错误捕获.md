## async函数的错误捕获
### 使用try catch
- 捕获异常后执行会中断。
```
const getInfo = () => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('请求异常');
    }, 1000)
  })
);

const test = async() => {
  try {
    const info = await getInfo();
    // 执行中断
    // ...
  } catch(e) {
    console.log(e)
  }
}

test();
```
### 直接catch
- 捕获异常后执行不会中断，返回值为undefined，如果有串行操作时需要特殊判断。
```
const getInfo = () => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('请求异常');
    }, 1000)
  })
);

const test = async() => {
  const info = await getInfo().catch(e => console.log(e))
  // 执行不会中断
  if (!info) return;
  // ...
}

test();
```
### 在catch中reject
- 捕获异常后执行会中断，但是会在控制台暴露uncaught(in promise)的报错信息。
```
const getInfo = () => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('请求异常');
    }, 1000)
  })
);

const test = async() => {
  const info = await getInfo().catch(e => {
    console.log(e);
    return Promise.reject(e);
  })
  // 执行中断
  // ...
}

test();
```
### 总结
- 不需要在await处异常时中断时可以使用直接catch的形式。
- 需要在await处异常时终端时使用try catch的形式。
