## JWT(JSON Web Token)
- 过往的Token形式服务端验证客户端发送过来的Token时，需要查询数据库获取用户基本信息，然后验证Token是否有效。这样每次请求验证都要查询数据库，增加了查库带来的延迟等性能消耗。
- JWT就是登录成功后将相关用户信息组成JSON对象，然后对这个对象进行某种方式的加密，返回给客户端。客户端在下次请求时带上这个Token，服务端再收到请求时直接校验Token的合法性并解析获取到用户信息。
### JWT的优点
- 校验Token合法性时不需要查询数据库，减少服务端查询数据库的次数。
### JWT的缺点
- 到期问题：一旦JWT签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
### JWT和Token的区别
- JWT和Token区别主要体现在校验Token合法性时是否需要进入数据库查询信息。
### eggjs实现JWT校验
- 安装依赖
```
npm install egg-jwt;
```
- config.default.js
```
exports.jwt = { 
  secret: 'login-server', // 可以自定义秘钥
};
```
- plugin.js
```
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
```
- 登录时签发Token和Refresh Token
```
// 登录
async login() {
  const userData = this.ctx.request.body;
  const access_token = this.app.jwt.sign({
    ...userData,
    exp: Math.floor(Date.now() / 1000) + 60 // token有效期60秒
  }, this.app.config.jwt.secret);
  const refresh_token = this.app.jwt.sign({
    ...userData,
    exp: Math.floor(Date.now() / 1000) + 120 // refresh_token有效期120秒
  }, this.app.config.jwt.secret);
  this.ctx.body = {
    success: true,
    data: {
      access_token,
      refresh_token,
    },
    msg: null,
  };
}
```
- 校验Token
```
async upsert() {
  const userData = this.ctx.request.body;
  const accessToken = this.ctx.request.headers.access_token; // 获取header的accessToken
  let checkTokenInfo = null; // token校验信息
  try {
    checkTokenInfo = this.app.jwt.verify(token, this.app.config.jwt.secret);
  } catch (error) {
    checkTokenInfo = null;
  }
  if (checkTokenInfo) {
    this.ctx.body = {
      success: true,
      data: checkTokenInfo,
      msg: null,
    };
  } else {
    this.ctx.status = 401;
    this.ctx.body = {
      success: false,
      data: null,
      msg: 'token已过期'
    };
  }      
}
```
- 刷新Token
```
// 刷新token
async refreshToken() {
  const { refresh_token } = this.ctx.request.body;
  let checkTokenInfo = null; // token校验信息
  try {
    checkTokenInfo = this.app.jwt.verify(refresh_token, this.app.config.jwt.secret);
  } catch (error) {
    checkTokenInfo = null;
  }
  if (checkTokenInfo) {
    // refresh_token校验通过生成新的Token和refresh_token
    const { username, password } = userData;
    const access_token = this.app.jwt.sign({
      username,
      password,
      exp: Math.floor(Date.now() / 1000) + 60 // token有效期
    }, this.app.config.jwt.secret);
    const refresh_token = this.app.jwt.sign({
      username,
      password,
      exp: Math.floor(Date.now() / 1000) + 120 // refresh_token有效期
    }, this.app.config.jwt.secret);
    this.ctx.body = {
      success: true,
      data: {
        access_token,
        refresh_token,
      },
      msg: null,
    };
  } else {
    this.ctx.status = 401;
    this.ctx.body = {
      success: false,
      data: null,
      msg: 'refresh_token过期'
    };
  }
}
```