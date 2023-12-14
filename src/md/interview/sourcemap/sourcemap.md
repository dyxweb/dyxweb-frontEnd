## sourcemap
> sourcemap是从已转换混淆的代码映射到原始代码的文件，包含着源代码与构建产物之间的映射关系，作用是实现运行时代码和开发时代码都能拥有相同准确的信息提示。

### sourcemap文件不会影响网页性能
- sourcemap只有在打开devtools的情况下才会开始下载，而大部分用户不会去打开这个面板，所以不会有性能问题。
- 浏览器隐藏了sourcemap文件的下载，使用抓包工具可以看到sourcemap文件的下载。
### 源文件和sourcemap文件关系
- 构建工具开启了sourcemap功能之后，build后的js文件都会有一个对应的.js.map文件，而在build后的js文件中有一段注释标记了该文件对应的sourcemap文件位置。
```
// main.d4c530be.js
...
...
...
//# sourceMappingURL=main.d4c530be.js.map
```
### 通过sourcemap定位源码信息
- next.js使用source-map插件会找不到mappings.wasm文件，使用source-map-js插件代替。
- 解析源码使用source-map插件，直接使用error信息的source字段对应的文件可能无法解析到源码(webpack分包情况下)，可以使用error的stack堆栈信息的第一条对应的文件进行解析。
- 使用error-stack-parser插件解析error的stack堆栈信息。
```
const sourceMap = require("source-map");
const ErrorStackParser = require('error-stack-parser');
const fs = require("fs");

// 解析错误堆栈信息(errorStack为js错误信息的stack字段内容)
const errorStackData = ErrorStackParser.parse(new Error(errorStack));
const { fileName, lineNumber, columnNumber } = errorStackData?.[0] || {};
if (fileName.split('/').pop()) {
  // 读取对应的.js.map文件
  const mapObj = fs.readFileSync(`${__dirname}/../public/static/js/${fileName.split('/').pop()}.map`, 'utf-8');
  const consumer = await new sourceMap.SourceMapConsumer(mapObj);
  // 根据报错信息映射出报错的源文件和错误的行数、列数
  const originalInfo = consumer.originalPositionFor({ line: lineNumber, column: columnNumber });
  // 获取报错源文件的代码
  const sourceCode = consumer.sourceContentFor(originalInfo.source);
  // 错误源码信息
  const errorSource = {
    ...originalInfo,
    sourceCode,
  }
}
```
### 将sourcemap单独打包
- sourcemap默认和build文件打包到同一个文件夹。
- 使用webpack.SourceMapDevToolPlugin打包到指定文件，sourcemap文件更新后会自动覆盖之前的sourcemap文件。
```
// static文件夹存放build后的文件，将sourcemap文件存储在sourcemaps文件夹下(和static文件夹同级目录)
new webpack.SourceMapDevToolPlugin({
  filename: 'sourcemaps/[file].map',
  fileContext: 'static',
}),
```
### 浏览器中sourcemap生效
- 浏览器默认会开启sourcemap，如果没有开启可以通过 settings => preferences => enable javascript source map 开启sourcemap。
### sentry上传sourcemap文件
- [sentry](https://juejin.cn/post/7209648356530962489#heading-10)
