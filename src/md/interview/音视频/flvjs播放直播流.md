## flvjs播放直播流
**火狐浏览器不支持使用flv.js播放flv资源，因为火狐不支持265视频编码**
### 安装依赖
```
npm install flv.js
```
### 播放直播流
```
import flvjs from 'flv.js';

if (flvjs.isSupported()) {
  const videoDom = document.getElementById('video');
  const flvPlayer = flvjs.createPlayer({
    type: 'flv',
    isLive: true,
    cors: true,
    hasAudio: false,
    hasVideo: true,
    url: liveUrl
  }); // 创建flvPlayer
  flvPlayer.attachMediaElement(videoDom); // 挂载元素
  flvPlayer.load(); // 加载视频流
  flvPlayer.play(); // 播放视频流
}
```
### 销毁flv播放器
```
flvPlayer.pause();
flvPlayer.unload();
flvPlayer.detachMediaElement();
flvPlayer.destroy();
```
### 获取单位时间获取的数据量
- 当推流速度快于播放速度时，后面正常播放但是不再获取数据会显示0。
```
flvPlayer.on('statistics_info', (res) => {
  console.log(res.speed); // KB/S
});
```
### 页面不可见时会暂停拉流
- mpegtsjs、flv.js在页面不可见时不会暂停播放停止拉流。
### The play() request was interrupted by a call to pause()错误
> 错误原因是因为在播放视频(play方法)之前被调用的pause方法中断了。

- 资源加载不成功(直播流链接错误)，导致没有资源可以播放。
- 时机不对，可添加定时器处理。
```
flvPlayer.load();
setTimeout(() => {
  flvPlayer.play();
}, '时间')
```
### 追帧
> 直播暂停后继续播放时切换到最新的画面帧。
