## react中使用
- addBreadcrumb不能直接上报信息，可用于上报信息前添加面包屑信息。
```
Sentry.addBreadcrumb({
  type: '记录',
  level: 'info',
  category: 'home',
  message: '进入首页456',
  data: { cateId: cateIdArr }
});
Sentry.captureMessage('dyx');
```