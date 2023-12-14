## 设备dpr大于1的处理
### 现状
- 实时监控页面、视频回放页面单独添加了zoom属性。

### 注意事项(以dpr为1.5举例)
- 全局的zomm加在body上，如果加载根节点上UI组件会有浮层定位异常的问题。zoom: 0.67  done
- 添加zoom后，所有浮层相关内容的显示处理。
  1. Tooltip相关
  2. Select、RangePicker相关
- RangePciker弹层的定位问题
  1. antd5没有问题
  2. 将弹层挂载在当前节点时问题较多
    - 弹窗里的使用时的问题
    - 宽度的问题
    - 在边缘放不下的问题
    - 箭头朝下的问题
  3. 将弹层挂载在全局设置反向zoom的节点(通过设置pointer-events: none可以是点击操作穿过遮挡层)。
    - 位置有点小问题
- [Echarts鼠标定位偏移问题](https://blog.csdn.net/LP_Reed/article/details/128202856)  done
  1. canvas元素上添加 zoom: 1.5; transform: scale(0.67); transform-origin: 0px 0px; 样式是缩放后的效果  (采用此方式)
  2. canvas元素外层容器添加 zoom: 1.5; 样式是缩放前的效果
- 影响vw/vh的最终结果
- 地图弹窗的显示以及经纬度的准确度
  1. 设置viewMode: '3D'时无效。
  2. 地图外层容器设置zoom为1.5。 有效
  3. 地图组件使用iframe加载，性能较差其实现复杂。是否有效未确定。