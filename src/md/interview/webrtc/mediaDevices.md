## mediaDevices
### avigator.mediaDevices在以下三种情况下可以获取到，否则会获取不到媒体权限navigator.mediaDevices为undefined。
1. 地址为localhost://访问时
2. 地址为https://访问时
3. 以文件路径file:///访问时