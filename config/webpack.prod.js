const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    main: "./src/index.js"
  },
  output: {
    publicPath: 'https://dyxweb.github.io/dyxweb-frontEnd/',
    path: path.resolve(__dirname, '../docs'),
    filename: '[name].[contenthash].js',
  },
  // optimization: {
  //   // 分割代码块
  //   splitChunks: {
  //     chunks: 'all',
  //     minChunks: 1,
  //   },
  //   runtimeChunk: {
  //     name: 'runtime',
  //   }
  // },
  plugins: [
    new webpack.DefinePlugin({
      'QUERYHOST': JSON.stringify('/api'),
    }), // 定义全局的变量(一般用于区分生产环境和开发环境)
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip', // 算法
      test: new RegExp(
        '\\.(js|css|less|scss)$' // 压缩 js 与 css
      ),
      // threshold: 10240,//只处理比这个值大的资源。按字节计算
      // minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
    }),
    new CleanWebpackPlugin(),
  ]
})