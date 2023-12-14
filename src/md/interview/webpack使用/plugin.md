## plugin
- 专注处理webpack在编译过程中的某个特定的任务的功能模块，可以称为插件。
- plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务。
### HotModuleReplacementPlugin
- 模块热更新插件。HotModuleReplacementPlugin的热更新是依赖于webpack-dev-server，后者是在打包文件改变时更新打包文件或者reload刷新整个页面，HRM是只更新修改的部分。
- HotModuleReplacementPlugin是webpack模块自带的，webpack5已经内置该插件。
```
// v4
plugins: [
  new webpack.HotModuleReplacementPlugin(), // 热更新插件
]

// v5
devServer: {
  hot: true,
}
```
### define-plugin
> 定义全局的变量(一般用于区分生产环境和开发环境)。使用时不能通过window.QUERYHOST获取，直接通过QUERYHOST使用变量。

```
plugins: [
  new webpack.DefinePlugin({
    'QUERYHOST': JSON.stringify('http://localhost:7001/api'),
  })
]
```
### html-webpack-plugin
- 生成html文件，将webpack打包生成的js、css文件插入到html文件中。
- 默认添加脚本标签位置是头部而不是主体，由于脚本标记具有defer属性，因此只有在解析了HTML后脚本才会加载，所以不会有任何问题。如果仍然希望将脚本标记添加到正文的末尾，则可以使用inject选项。
  1. true：默认值，根据scriptLoading选项选择插入head或body。
  2. head：script标签位于head标签内。
  3. body：script标签位于html文件的body底部。
  4. false：不插入生成的js文件，只是单纯的生成一个html文件。
- 自动引入打包后的资源(比如资源名称含hash值的情况)
```
new HtmlWebpackPlugin({
  filename: 'index.html', // 配置输出文件名和路径
  template: path.join(__dirname, "../template/index.html") // 配置文件模板
})
```
- 多入口
  - filename字段不可缺省，否则默认生成的都是index.html。
  - 通过chunks参数配置该html引入的js模块。
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode:'development', // 开发模式
  entry: {
    main:path.resolve(__dirname,'../src/main.js'),
    header:path.resolve(__dirname,'../src/header.js')
  }, 
  output: {
    filename: '[name].[hash:8].js',      // 打包后的文件名称
    path: path.resolve(__dirname,'../dist')  // 打包后的目录
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/index.html'),
      filename:'index.html',
      chunks:['main'] // 与入口文件对应的模块名
    }),
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/header.html'),
      filename:'header.html',
      chunks:['header'] // 与入口文件对应的模块名
    }),
  ]
}
```
### clean-webpack-plugin
> 当打包后的文件名字固定时，新的打包文件会自动覆盖上次的，如果文件名使用了hash，则不会自动删除上次打包的文件，使用clean-webpack-plugin可以自动清除上次打包的文件，避免多次打包后文件夹存在之前打包的文件内容。

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins: [
  new CleanWebpackPlugin(),
],
```
### hard-source-webpack-plugin
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
### mini-css-extract-plugin
- 将css分开打包。
### compression-webpack-plugin
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
### copy-webpack-plugin
- 在public/index.html中引入了静态资源，但是打包的时候webpack并不会帮我们拷贝到build目录，copy-webpack-plugin可以将静态资源拷贝到build目录。
```
// 复制public目录文件到build目录
new CopyPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, '../public'),
      to: path.resolve(__dirname, '../build'),
      filter: source => {
        return !source.includes('public/index.html')
      }
    },
  ],
})
```
### IgnorePlugin
- webpack内置插件，可以忽略第三方包指定目录，让这些指定目录不要被打包进去。
- 忽略moment的多语言包。
```
const Webpack = require('webpack')

plugins: [
  // moment这个库中如果引用了./locale/目录的内容，就会被忽略掉不会打包进去
  new Webpack.IgnorePlugin(/\.\/locale/, /moment/),
]
```
- 引入需要使用的语言包比如中文语言包
```
import moment from 'moment'

// 手动引入所需要的语言包
import 'moment/locale/zh-cn'
```
### UglifyJsPlugin
- uglifyJsPlugin是vue-cli默认使用的压缩代码方式，用来对js文件进行压缩，从而减小js文件的大小，加速load速度。
- 使用的是单线程压缩代码，打包时间较慢，所以可以在开发环境将其关闭，生产环境部署时再把它打开。
```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

plugins: [
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false
      }
    },
    sourceMap: true,  // 是否启用文件缓存
    parallel: true   // 使用多进程并行运行来提高构建速度
  })
]
```
### ParallelUglifyPlugin
- 开启多个子进程，把对多个文件压缩的工作分别给多个子进程去完成，每个子进程其实还是通过UglifyJS去压缩代码，但是变成了并行执行。
```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

plugins: [
  new ParallelUglifyPlugin({
    // cacheDir用于配置缓存存放的目录路径。
    cacheDir: '.cache/',
    sourceMap: true,
    uglifyJS: {
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
      },
    },
  }),
]
```
### terser-webpack-plugin
- webpack4默认是使用terser-webpack-plugin压缩插件，在此之前是使用uglifyjs-webpack-plugin，terser-webpack-plugin对ES6的压缩更好。
- 开启parallel参数，使用多进程压缩加快压缩。
```
const TerserPlugin = require('terser-webpack-plugin') // 压缩js代码

optimization: {
  minimizer: [
    new TerserPlugin({
      parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
      cache: true, // 是否缓存
    }),
  ]
}
```
### css-minimizer-webpack-plugin
- 压缩css
```
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

// 直接在plugins中使用插件
module.exports = {
  // ...
  plugins: [
    // ...
    new CssMinimizerWebpackPlugin(), // 压缩css
  ]
}

// 或在optimization.minimizer中使用插件
module.exports = {
  // ...
  optimization: {
    minimizer: [
      new CssMinimizerWebpackPlugin(), // 压缩css
    ],
  },
}
```
### unused-files-webpack-plugin 
- 查找无用文件(webpack4)
```
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
 
// 会输出无用文件目录
module.exports = {
  plugins: [
    new UnusedFilesWebpackPlugin(),
  ],
};

// cwd  插件检索的目录
globOptions: { cwd: path.resolve(__dirname, "../src") },

// 找到未使用的文件直接退出命令 默认false
failOnUnused: true, 
```
- 查找无用文件(webpack5)
```
const UselessFile = require('useless-files-webpack5-plugin')

module.exports = {
  plugins: [
    new UselessFile({
      webpack: '5',
      root: path.resolve(__dirname, '../src'),
      out: './fileList.json',
      clean: true,
    }),
  ],
}
``` 
### webpack-bundle-analyzer
> 运行打包命令，打开的页面会显示各个模块的大小。

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
### Speed Measure Plugin
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