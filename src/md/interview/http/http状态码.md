## http状态码
> HTTP 的状态码为三位数。

- 1xx: 表示目前是协议处理的中间状态，还需要后续操作。
- 2xx: 表示成功状态。
- 3xx: 重定向状态，资源位置发生变动，需要重新请求。
- 4xx: 请求报文有误。
- 5xx: 服务器端发生错误。
### 1xx
- 101 Switching Protocols。在HTTP升级为WebSocket的时候，如果服务器同意变更，就会发送状态码 101。
### 2xx
- 200 OK：请求成功。
- 204 No Content含义与 200 相同，但响应后没有 body 数据。
- 206 Partial Content顾名思义，表示部分内容，它的使用场景为 HTTP 分块下载和断点续传，当然也会带上相应的响应头字段Content-Range。
### 3xx
- 301 Moved Permanently即永久重定向。比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。
- 302 Found，即临时重定向。如果只是暂时不可用，那么直接返回302即可，和301不同的是，浏览器并不会做缓存优化。
- 304 Not Modified  当协商缓存命中时会返回这个状态码。
### 4xx
- 400 Bad Request：错误请求，客户端发送的请求有错误，服务器无法理解。
- 401 Unauthorized：未授权，未登录，表示请求需要用户认证，但用户未提供有效的身份验证信息。
- 403 Forbidden：已登录，无权限，表示服务器理解请求但拒绝执行。与401不同的是403表示服务器知道用户是谁，但是不允许访问所请求的资源。
- 404 Not Found：错误请求，未找到资源。
- 405 Method Not Allowed：请求的方法不允许。
- 406 Not Acceptable: 资源无法满足客户端的条件。
- 408 Request Timeout：请求超时，表示服务器等待客户端发送的请求时间过长。
- 409 Conflict: 多个请求发生了冲突。
- 413 Request Entity Too Large: get请求体的数据过大。
- 414 Request-URI Too Long: 请求行里的 URI 太大。
- 429 Too Many Request: 客户端发送的请求过多。
- 431 Request Header Fields Too Large请求头的字段内容太大。
### 5xx
- 500 Internal Server Error：服务端报错，表示服务器在处理请求时发生了意外的错误。
- 501 Not Implemented：网络未实现，表示服务器不支持实现请求所需的功能。当服务器无法识别请求的方法，或者没有为该方法实现任何功能时，服务器就会返回501状态码。
- 502 Bad Gateway: 服务器自身是正常的，但访问的时候出错了，具体什么错无法知道。
- 502 Bad Gateway：网关错误。
- 503 Service Unavailable：服务不可以使用，该状态码表示服务器暂时处于超载或正在停机维护，无法处理请求。
- 504 Gateway Timeout：网关超时。
- 505 HTTP Version Not Supported：HTTP协议版本不支持。
