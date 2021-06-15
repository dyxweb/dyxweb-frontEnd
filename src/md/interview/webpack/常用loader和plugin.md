## 常用loader和plugin
### loader
#### raw-loader
> 此loader可以允许我们以字符串的形式引入文件原始内容，比如markdown文件等。

```
rules: [
  {
    test: /\.md$/,
    use: 'raw-loader'
  }
]
```
#### markdown-loader
> 使用markdown-loader以及html-loader可以将引入的markdown文件转为html。代码区块有空行会显示错误。

```
{
  test: /\.md$/,
  use: ['html-loader', 'markdown-loader'],
},
```
### plugin
#### define-plugin
> 定义全局的变量(一般用于区分生产环境和开发环境)

```
plugins: [
  new webpack.DefinePlugin({
    'QUERYHOST': JSON.stringify('http://localhost:7001/api'),
  })
]
```
#### html-webpack-plugin
> 自动引入打包后的资源

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
new HtmlWebpackPlugin({
  filename: 'index.html', // 配置输出文件名和路径
  template: path.join(__dirname, "../template/index.html") // 配置文件模板
})
```
#### clean-webpack-plugin
> 当打包后的文件名字固定时，新的打包文件会自动覆盖上次的，如果文件名使用了hash，则不会自动删除上次打包的文件，使用clean-webpack-plugin可以自动清除上次打包的文件。

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins: [
  new CleanWebpackPlugin(),
],
```
#### hard-source-webpack-plugin
> 可以优化构建速度,第一次构建将花费正常的时间,第二次构建将明显加快（大概提升90%的构建速度。缓存文件默认存在node_module下。webpack5.0会把hard-source-webpack-plugin内置成一个配置。

```
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
plugins: [
  new HardSourceWebpackPlugin({
    cachePrune: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 设置缓存文件过期时间为2天
      sizeThreshold: 500 * 1024 * 1024, // 总缓存文件大于500M时才会自动删除过时的缓存文件
    },
  }),
]
```
#### extract-text-webpack-plugin
> 将css分开打包
```
const ExtractTextPlugin = require('extract-text-webpack-plugin');
{
  test: /.css$/,
  use: ExtractTextPlugin.extract({ // 调用分离插件内的extract方法
    fallback: 'style-loader', // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
    use: ['css-loader', 'postcss-loader']
  })
},
plugins: [
  new ExtractTextPlugin('index.css'), // 将css分离到/public文件夹下的css文件夹中的index.css
]
```
#### compression-webpack-plugin
> 将文件压缩成gzip的形式

```
const CompressionPlugin = require('compression-webpack-plugin');
new CompressionPlugin({
  filename: '[path].gz[query]',
  algorithm: 'gzip', // 算法
  test: new RegExp(
    '\\.(js|css|less|scss)$' // 压缩 js 与 css
  ),
  // threshold: 10240, // 只处理比这个值大的资源。按字节计算
  // minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
}),
```
#### webpack-bundle-analyzer
> 运行打包命令，打开的页面会显示各个模块的大小

```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info'
  })
]
```
#### Speed Measure Plugin
> 对打包过程中消耗的时间进行精确的统计，能够测量出在你的构建过程中，每一个 Loader 和 Plugin 的执行时长,在启动本地服务的命令行中显示。smp.wrap包裹所有的webpack的配置module.exports = smp.wrap({})，使用webpack-merge后不用加smp.wrap({}), 引入插件即可。

```
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
  plugins: [
    new MyPlugin(),
    new MyOtherPlugin()
  ]
});
```