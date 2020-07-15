const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    // 分割代码块
    splitChunks: {
      chunks: 'all',
      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vendor', // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！
          test: /node_modules/, // 一般第三方模块都是从node_modules引进来如lodash
          minSize: 0,  // 大小限制
          minChunks: 1  // 最少复用过几次
        },

        // 公共的模块
        common: {
          name: 'common', // chunk 名称
          priority: 0, // 优先级
          minSize: 0,  // 公共模块的大小限制
          minChunks: 2  // 公共模块最少复用过几次
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'QUERYHOST': JSON.stringify('http://47.99.184.72:7001/api'),
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
    new CleanWebpackPlugin()
  ]
})