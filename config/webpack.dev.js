const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,{
  entry: {
    main: "./src/index.js"
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../docs'),
    filename: '[name].[hash].js',
  },
  devServer: {
    contentBase: "./docs", // 本地服务器所加载的页面所在的目录
    port: "8000", // 设置端口号
    historyApiFallback: true , // 跳转指向index.html
    inline: true, // 实时刷新，源文件修改自动刷新页面
    hot:true,
    progress: true
  } ,
  devtool: 'eval-source-map', // 打包后方便调试
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'QUERYHOST': JSON.stringify('http://localhost:7001/api'),
    }) // 定义全局的变量(一般用于区分生产环境和开发环境)
  ]
})