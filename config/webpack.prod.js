const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = merge(common, {
  mode: 'production',
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
    }),
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
  ]
})