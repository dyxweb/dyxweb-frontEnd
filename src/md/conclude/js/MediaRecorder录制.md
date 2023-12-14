## [MediaRecorder录制](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream_Recording_API)
- MediaRecorder调用start()后ondataavailable一直没有数据。
```
mediaRecorder.start();
改成(此处25是fps)
mediaRecorder.start(1000/25);
```
- 录制的视频没有时长也拖动不了，应该是元数据的原因。
  1. fix-webm-duration需要手动传duration，导出视频有误
  2. ts-ebml使用3.0版本直接报错，使用2.0版本逻辑也有问题，直接引入js文件可正常使用。
  3. RecordRTC录制的blob为null

- 屏幕录制
```
// 只提示当前标签页的选项
navigator.mediaDevices.getDisplayMedia({
  preferCurrentTab: true,
  audio : false,
  video: {
    displaySurface : "browser"
  },
});
```
- 控制共享开始和结束
```
// 开始录制
const startRecorder = async () => {
  screenStream.current = await navigator.mediaDevices.getDisplayMedia({
    audio : false,
  });
  // 开始共享之后播放视频
  onPlay();
  mediaRecorderRef.current = new MediaRecorder(screenStream.current);
  mediaRecorderRef.current.ondataavailable = (e: any) => {
    if (e && e.data && e.data.size > 0) {
      recorderDataBuffer.current.push(e.data);
    }
  };
  mediaRecorderRef.current.onerror = () => {
    message.error('录制出现错误');
  };
  mediaRecorderRef.current.start(1000 / 25);
};

// 结束录制
const stopRecorder = async() => {
  if (mediaRecorderRef.current) {
    const blob = new Blob(recorderDataBuffer.current, { type: 'video/webm' });
    downloadBlob(blob, `dyx.mp4`);
    recorderDataBuffer.current = [];
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;
    if (screenStream.current) {
      // 结束共享
      screenStream.current.getTracks().forEach((track: any) => {
        track.stop();
      });
      screenStream.current = null; // 清空媒体流引用
    }
  }
}
```
### rrweb
- rrweb是记录页面dom变化数据，无法直接播放录制的数据，需要借助rrweb的player。