
## Token
1. 客户端向服务器发送登录信息用户名/密码来请求登录。
2. 服务器收到请求去验证用户名与密码，验证成功后服务端会签发一个Token并把这个Token发送给客户端。
3. 客户端收到Token后会把它存储起来，web端一般会放在localStorage或Cookie中，移动端原生APP一般存储在本地缓存中。
4. 客户端向服务端请求API资源的时候，将Token通过HTTP请求头Authorization字段或者其它方式发送给服务端。
5. 服务器收到请求后会去验证客户端请求里面带着的Token，根据Token验证结果判断该请求是否合法。
### Token的优点
- 服务端无状态化、可扩展性好，Token机制在服务端不需要存储会话（Session）信息，因为Token自身包含了其所标识用户的相关信息，这有利于在多个服务间共享用户状态。
- 安全性好，有效避免CSRF攻击（不依赖Cookie的使用）。
- 支持跨程序调用：因为Cookie是不允许跨域访问的，而Token则不存在这个问题。
### Token的缺点：
- 需要前后端配合处理。
- Token正常情况下比sid大，消耗更多流量，占用更多宽带。
- 验证Token时需要对Token进行加解密或查询数据库等操作，可能会更耗性能。
- 有效期短，为了避免Token被盗用，一般Token的有效期会设置的较短，使用Refresh Token更新Token。
### Token和Session-Cookie的区别
> Session-Cookie和Token有很多类似的地方，但是Token更像是Session-Cookie的升级改良版。

- 存储地不同：Session一般是存储在服务端，Token是无状态的一般由前端存储。
- 安全性不同：Token不依赖浏览器的Cookie机制，可以降低web攻击的风险。
- 支持性不同：Session-Cookie认证需要依赖浏览器的Cookie机制，如果遇到原生应用或浏览器的Cookie功能被禁用时这种机制就不起作用了。
