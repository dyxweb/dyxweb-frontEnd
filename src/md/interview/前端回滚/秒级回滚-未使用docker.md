## [秒级回滚-未使用docker](https://juejin.cn/post/7251181090395111483)
### 实现思路
- 单页应用打包后都有一个index.html入口文件，每一次打包后的index.html里面都会引入本版本所需要的静态资源，如果我们不删除过往版本的静态资源(或者上传到oss上面)，并且每次项目打包都把本次打包的信息和index.html内容保存起来，保存一个数组列表数据。
- 在需要回滚版本时，通过前端可视化界面可以选择项目中某个分支中的构建记录进行快速回滚。具体实现原理就是用回滚版本存的index.html内容替换当前项目正在使用的index.html内容，替换index.html内容后，引入的静态资源都会变成该版本打包出来的静态资源路径，从而实现快速回滚。
- 整体思路就是保留历史构建的css，js，图片等静态资源，保存每一次构建的index.html内容，回滚时用对应版本的index.html内容替换当前的内容，实现真正的秒级回滚。
### 存储每次打包的信息和index.html内容
- 在每一次打包命令结束后执行build.js脚本，保存历史构建记录。
```
// build.js
import path from 'path'
import fs from 'fs'

function start() {
  // 设置存储构建的history.json文件路径
  const historyPath = path.resolve('history.json')
  // 如果json文不存在就创建一个，初始值为 { list: [] }
  if(!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify({ list: [] }))
  }
  // 读取本次打包后的dist/index.html内容
  const html = fs.readFileSync(path.resolve('./dist/index.html'), 'utf-8')
  // 获取到当前histyory.json的内容
  const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'))
  // 将当前打包的信息push到history的list中，包含构建时间和index.html内容还有id
  // 实际应用中还可以添加其他的很多信息
  history.list.push({
    time: new Date().toLocaleString('zh-cn'),
    html,
    // 模拟生成一个随机的id
    id: Math.random().toString(16).substr(2),
    // ... 分支信息，commit信息，构建时间，构建人，构建环境等字段
  })

  // 将最新的构建记录内容写入到history.json中
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
}

start()
```
### 创建一个node服务和一个前端可视化回滚页面来实现回滚逻辑
- 在前端可视化页面选择某一次构建记录后，把id传给node服务器。
- 服务器根据id找到对应的html内容，用html内容替换dist/index.html的内容。
- 替换完成后用户访问页面就可以访问到对应版本的内容了，实现了秒级回滚。
### 保留历史构建静态资源的方式还可以规避两个常见的问题：
1. 前端构建时dist文件被清空，此时前端访问项目会访问不到。
2. 用了路由懒加载，新版本发布后，原文件消失，用户跳转页面请求资源会404，造成页面异常。
### 历史构建静态资源积累造成资源浪费
- 只保留最近5次的构建结果，5次之外的构建资源去进行删除，这样既能实现秒级回滚，又不会造成太多的资源浪费。