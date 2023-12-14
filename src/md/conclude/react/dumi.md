## dumi V2版本
- docs文件夹为组件库文档目录，文件名对应顶部导航名称，src文件夹为组件库源码目录，每个组件文件夹下包含组件源码及文档。
- resolve.atomDirs的type可以配置默认组件渲染的路由，例如配置为type: 'hook'，组件渲染的路由由/components调整为/hooks。
- 组件渲染的导航名称默认为组件目录下的首文件夹名字，可以在组件的md文件中配置nav属性来自定义导航名称。
```
---
nav: hooks
---
```
- build打包是打包组件库，docs:build是打包组件库文档应用。