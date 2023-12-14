## ResizeObserver
- 监听元素的尺寸变化，相较于window的resize事件可以监听具体的元素尺寸变化，同时有更好的性能。
- 所监听元素的父元素设置隐藏(比如Tab切换)也可以通过ResizeObserver监听到尺寸变化。
### ResizeObserver.observe()
- 开始对指定元素的监听，可以调用多次监听多个元素。
- entries是数组格式，每一项是调用resizeObserver.observe传入的元素。即使只调用一次resizeObserver.observe，entries也是数组格式。
```
const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entry?.contentRect?.width && entry?.contentRect?.height) {
      echartsRef.current?.resize();
    }
  }
});
resizeObserver.observe(echartsWrapperRef.current);
```
### ResizeObserver.unobserve()
- 结束对指定元素的监听。
```
resizeObserver.unobserve(echartsWrapperRef.current);
```
### ResizeObserver.disconnect()
- 取消对所有元素的监听。
```
resizeObserver.disconnect();
```