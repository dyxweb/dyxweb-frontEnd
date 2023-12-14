## CORS
- 跨源资源共享是一种基于HTTP头的机制，该机制通过允许服务器标示除了它自己以外的其他源，使得浏览器允许这些源访问加载服务器的资源。
- 跨源资源共享还通过一种机制来检查服务器是否会允许要发送的真实请求，该机制通过浏览器发起一个到服务器托管的跨源资源的“预检”请求。在预检中浏览器发送的头中标示有HTTP方法和真实请求中会用到的请求头。
### CORS功能
- 跨源资源共享标准新增了一组HTTP标头字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。
- 对那些可能对服务器数据产生副作用的HTTP请求方法，浏览器必须首先使用OPTIONS方法发起一个预检请求(preflight request)，从而获知服务端是否允许该跨源请求。服务器确认允许之后浏览器才发起实际的HTTP请求。在预检请求的返回中服务器端也可以通知客户端是否需要携带身份凭证(例如Cookie和HTTP认证相关数据)。
- CORS请求失败会产生错误，但是为了安全在JavaScript代码层面无法获知到底具体是哪里出了问题，只能查看浏览器的控制台以得知具体是哪里出现了错误。
### CORS请求类型
- 一个请求可以附带很多信息，从而会对服务器造成不同程度的影响，比如有的请求只是获取一些信息，有的请求会改动服务器的数据。
- 针对不同的请求，CORS规定了三种不同的交互模式，分别是：简单请求、需要预检的请求、附带身份凭证的请求。这三种模式依次可以做的事越来越多，要求也越来越严格。
### 简单请求(同时满足以下要求)
> 使用请求头Origin和响应头Access-Control-Allow-Origin就能完成简单请求的访问控制。

- 使用下列方法之一
    - GET
    - HEAD
    - POST
- 除了被用户代理自动设置的请求头(例如Connection、User-Agent等)，允许人为设置的请求头字段如下
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type(需要注意额外的限制)
    - Range(只允许简单的范围请求头值如 bytes=256- 或 bytes=127-255)
- Content-Type请求头所指定的媒体类型的值仅限于下列之一
    - text/plain
    - multipart/form-data
    - application/x-www-form-urlencoded
- 如果请求是使用XMLHttpRequest对象发出的，在返回的XMLHttpRequest.upload对象属性上没有注册任何事件监听器。给定一个XMLHttpRequest实例xhr，没有调用 xhr.upload.addEventListener()监听该上传请求。
- 请求中没有使用ReadableStream对象。
### 需要预检的请求
> 需要预检的请求必须首先使用OPTIONS方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。预检请求的使用可以避免跨域请求对服务器的数据产生未预期的影响。

1. 浏览器发送预检请求，询问服务器是否允许后续的真实请求
    - 请求方法为OPTIONS。
    - 请求中不包含真实请求定义的请求头内容，也没有请求体。
    - 请求头中包含Origin：请求的源；Access-Control-Request-Method：后续的真实请求将使用的请求方法；Access-Control-Request-Headers：后续的真实请求会使用的请求头。
2. 服务器收到预检请求
    - 服务器收到预检请求后检查预检请求中包含的信息。
    - 如果允许这样的请求不需要响应任何的消息体，响应头会包含Access-Control-Allow-Origin：表示允许的源；Access-Control-Allow-Methods：表示允许的后续真实的请求方法；Access-Control-Allow-Headers：表示允许使用的请求头；Access-Control-Max-Age：告诉浏览器多少秒内对于同样的请求源、方法、请求头都不需要再发送预检请求了。
3. 浏览器判断预检请求响应头决定是否发起后续真实请求
    - 预检请求允许后续请求时，浏览器发送真实请求，服务器完成真实请求的响应。
    - 预检请求不允许后续请求时，浏览器不发送真实请求，浏览器network面板可以看到真实请求发送报CORS错误，其实服务端不会收到真实请求。
### 附带身份凭证的请求
> 默认情况下ajax的跨域请求并不会附带Cookie，这样某些需要权限的操作就无法进行，可以通过设置credentials实现跨域请求附带Cookie。

```
// xhr
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

// fetch api
fetch(url, {
  credentials: 'include',
});
```
- 当发起一个附带身份凭证的跨域请求时(无论是简单请求还是需要预检的请求)，服务器响应时需要在响应头中添加Access-Control-Allow-Credentials: true。若服务器没有明确告知客户端服务器允许这样的凭据，浏览器仍然视为跨域被拒绝。
- 特别注意的是对于附带身份凭证的请求，服务器不得设置Access-Control-Allow-Origin、Access-Control-Allow-Headers、Access-Control-Allow-Methods的值为*。
### 跨域请求时JS使用响应头
- 在跨域访问时JS只能拿到一些最基本的响应头如Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，如果要访问其它响应头则需要服务器特殊设置。
- 通过设置Access-Control-Expose-Headers响应头，服务器把允许浏览器访问的头放入白名单，这样JS就能够访问指定的响应头了。
```
Access-Control-Expose-Headers: authorization, a, b
```
