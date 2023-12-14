## history路由
- history路由模式如果跳转路由后再次刷新会出现404的错误，这个错误是因为浏览器把整个地址当成一个可访问的静态资源路径进行访问，然后服务端并没有这个文件。所以一般情况需要配置下nginx的try_files参数，当访问的路径资源不存在的时候默认指向静态资源index.html。
- 通过history.pushState或history.replaceState修改url且不引起页面的刷新。
```
history.pushState(state, title, path);
history.replaceState(state, title, path);
```
- 通过popstate事件监听history模式下url改变，从而更新页面内容。
  1. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮或者调用history.back()、history.forward()、history.go()方法。
  2. history.pushState()或者history.replaceState()改变url不会触发popstate事件。
```
window.addEventListener('popstate', () => {
  /* 监听改变 */
});
```
### history.pushState()或者history.replaceState()不会触发popstate事件
- 通过dispatchEvent改写这两个方法实现对这两个方法的监听。
```
const _wr = (type) => {
  const orig = history[type];
  return function () {
    const rv = orig.apply(this, arguments);
    const e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  }
}

history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');

window.addEventListener('pushState', () => {
  /* 监听改变 */
});
window.addEventListener('replaceState', () => {
  /* 监听改变 */
});
```
- 调用history.pushState()或者history.replaceState()时手动触发页面内容更新。
  1. 首先生成一个最新的location对象。
  2. 然后通过window.history.pushState或者window.history.replaceState方法改变浏览器当前url。
  3. 最后手动触发组件更新，并传递当前最新的location对象。
### demo
```
<body>
  <ul>
    <li><a href="/home">首页</a></li> 
    <li><a href="/about">关于</a></li>
  </ul>

  <div id="routeView"></div>

  <script>
    const routes = [
      {
        path: '/home',
        component: '首页内容'
      },
      {
        path: '/about',
        component: '关于页面内容'
      }
    ]
    
    const routeView = document.getElementById('routeView')
    window.addEventListener('DOMContentLoaded', onLoad)
    window.addEventListener('popstate', onPopState)

    function onLoad() {
      const links = document.querySelectorAll('li a')
      links.forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          history.pushState(null, '', a.getAttribute('href'))
          onPopState()
        })
      })
    }

    function onPopState() {
      routes.forEach((item) => {
        if (item.path === location.pathname) {
          routeView.innerHTML = item.component
        }
      })
    }
  </script>
</body>
```