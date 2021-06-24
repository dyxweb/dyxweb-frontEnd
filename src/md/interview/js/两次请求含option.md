## 两次请求包含一次option请求
> 与所使用的是不是http协议，和所采用的请求形式(是不是fetch)没有关系。之所以会发送2次请求，那是因为我们使用了带预检(Preflighted)的跨域请求。该请求会在发送真实的请求之前发送一个类型为OPTIONS的预检请求。预检请求会检测服务器是否支持我们的真实请求所需要的跨域资源，唯有资源满足条件才会发送真实的请求。

### 发送两次请求需要满足两个条件
1. 必须要在跨域的情况下。
2. 除GET、HEAD 和 POST(仅适用 application/x-www-form-urlencoded, multipart/form-data, text/plain 三种Content-Type)以外的跨域请求。