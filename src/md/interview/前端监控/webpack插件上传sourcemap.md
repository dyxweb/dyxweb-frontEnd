## webpack插件上传sourcemap
### 实现webpack插件
```
const fs = require('fs');
const http = require('http');
const glob = require('glob');
const path = require('path');

class UploadSourceMapWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  // 调用http接口上传sourcemap文件
  upload(url, file) {
    return new Promise(resolve => {
      const req = http.request(
        `${url}?name=${path.basename(file)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            Connection: "keep-alive",
            "Transfer-Encoding": "chunked"
          }
        }
      );

      fs.createReadStream(file).on("data", chunk => {
        req.write(chunk);
      }).on("end", () => {
        req.end();
        resolve();
      });
    })
  }

  apply(compiler) {
    // 定义在打包后执行
    compiler.hooks.done.tap('upload-sourecemap-plugin', async status => {
      // 读取sourcemap文件
      const list = glob.sync(path.join(status.compilation.outputOptions.path, `./**/*.{js.map,}`));
      for (let filename of list) {
        await this.upload(this.options.uploadUrl, filename);
      }
    })
  }
}

module.exports = UploadSourceMapWebpackPlugin;
```
### 使用webpack插件
```
// 上传sourcemap的插件
const UploadSourceMapWebpackPlugin = require('./plugin/uploadSourceMapWebPackPlugin');

plugins: [
  // 添加自动上传插件
  new UploadSourceMapWebpackPlugin({
    uploadUrl:'http://localhost:7001/monitor/sourcemap',
    apiKey: 'dyxweb'
  })
]
```
### 服务端添加sourcemap上传接口
```
async upload() {
  const { ctx } = this;
  const stream = ctx.req;
  const filename = ctx.query.name;
  const dir = path.join(this.config.baseDir, 'uploads');
  // 判断upload目录是否存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const target = path.join(dir, filename);
  const writeStream = fs.createWriteStream(target);
  stream.pipe(writeStream);
}
```