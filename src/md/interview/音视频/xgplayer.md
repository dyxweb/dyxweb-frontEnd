## [xgPlayer](https://h5player.bytedance.com/)
### 使用xgplayer-flv播放直播流
- 播放直播流时不支持显示播放进度条和播放时间。
- 在播放回放直播时推流速度快于播放速度时会自动追帧。
- 默认点击暂停按钮会停止拉流、重新播放后重新开始拉流。
- 页面隐藏时会触发pause事件停止拉流，页面显示后会重新播放开始拉流。
### error事件
- readyState(mediaElement readyState)为0时表示没有媒体资源数据，播放器显示网络错误请刷新。视频机不推流导致。
- readyState(mediaElement readyState)为2时表示数据已经可以播放(当前位置已经加载)但没有数据能播放下一帧的内容，播放器显示重播。网络错误或者视频机推流慢导致。
- readyState(mediaElement readyState)为4时可用数据足以开始播放 - 如果网速得到保障 那么视频可以一直播放到底，播放器显示网络错误请刷新。网络错误导致。
### 设置播放事件前置处理
- 自动播放以及暂停之后重新播放都会触发play事件。
```
player.setEventsMiddleware({
  play: async (e: any, callback: any) => {
    if (canPlay) {
      // 可直接播放时callback
      callback(e.eventName, e);
    } else {
      // 不可播放时请求接口后再callback
      // ...
      callback(e.eventName, e);
    }
  }
})
```
- playing事件不是暂停后恢复播放触发而是在播放过程中一直触发。