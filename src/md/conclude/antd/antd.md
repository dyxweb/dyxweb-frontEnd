## antd
- 自定义的组件可以通过Form.Item包裹后监听到值的变化，被包裹的组件自动有onChange和value两个属性，value改变时手动调用onChang方法。(https://blog.csdn.net/yang450712123/article/details/120133948)
- table锁列时TypeScript报错。
```
fixed: 'right' as 'right',
```
- treeSelect修改搜索时匹配的过滤属性：treeNodeFilterProp，默认匹配value进行过滤。
- treeSelect节点换行展示不全时设置dropdownMatchSelectWidth为false即可解决。
- antd组件通过defaultProps属性设置通用的props。
```
DatePicker.RangePicker.defaultProps = {}
```
### form
- 使用setFields时要将errors设置为undefined，不能使用`[]`，使用`[]`会报There may be circular references错误，也不能省略errors的设置。
- form使用scrollToFirstError时当页面存在多个表单且表单项的name存在重复时会出现无法滚动到对应位置的情况，可以通过为form整体设置唯一的name属性实现表单项的唯一从而实现滚动到对应位置的效果。
- scrollToFirstError={{ block: 'center' }}可以控制错误项出现在页面，便于明显提示。
### modal
- modal使用open控制显示时，关闭弹窗后DOM结构只会隐藏不会真正删除，且内部的内容会被缓存。
- modal使用条件渲染时，关闭弹窗后DOM结构会真正删除，内部的内容不会缓存。
- modal内部使用form时注意form的缓存的机制，重点在useForm返回form的使用。

### v4
- modal中有表格请求数据时导致弹窗渲染比较慢，初始请求延迟会有效果。
- tab切换时tab响应慢是因为组件内部DOM结构复杂导致的。
- dropDown中使用menu无法非受控显示。