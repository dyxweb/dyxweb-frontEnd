## hash路由
- hash路由模式不需要服务端特殊处理。
- url中接一个#，#后的值就是哈希值，在浏览器url后加个哈希值，哈希值的变更不会引起浏览器页面的刷新。通过window.location.href或window.location.replace改变哈希值。
```
window.location.href = '';
window.location.replace = '';
```
- hashchange事件可以自动监听hash值的变更，从而更新页面内容。a标签跳转、浏览器前进后退、window.location方法都会触发hashchange事件。
```
window.addEventListener('hashchange', (e) => {
  /* 监听改变 */
  const oldURL = e.oldURL; // 改变后旧的页面路径
  const newURL = e.newURL; // 改变后新的页面路径
});
```
### demo
```
<body>
  <ul>
    <li><a href="#/home">首页</a></li> 
    <li><a href="#/about">关于</a></li>
  </ul>

  <div id="routeView"></div>

  <script>
    const routes = [
      {
        path: '#/home',
        component: '首页内容'
      },
      {
        path: '#/about',
        component: '关于页面内容'
      }
    ];
      
    const routeView = document.getElementById('routeView')
    window.addEventListener('DOMContentLoaded', onHashChange) 
    window.addEventListener('hashchange', onHashChange)
    
    function onHashChange() {
      routes.forEach((item, index) => {
        if (item.path === location.hash) {
          routeView.innerHTML = item.component
        }
      })
    }
  </script>
</body>
```