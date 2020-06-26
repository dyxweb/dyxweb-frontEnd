const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /(.jsx|.js)$/, 
        use: [
          'cache-loader',
          {
            loader: "babel-loader",
            options: { "plugins": [ ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] ] }
          },
        ],
        exclude: /node_modules/  // 排除匹配node_modules模块
      },
      {
        test: /.css$/,
        use: ExtractTextPlugin.extract({ // 调用分离插件内的extract方法
          fallback: 'style-loader', // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /.less$/,
        use: [
          'cache-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, 
              localIdentName: '[name]__[local]--[hash:base64:5]' 
            },
          },
          'less-loader',
          'postcss-loader',
        ] 
      },
      {
        test: /\.(md)$/,
        use: ['html-loader', 'markdown-loader'],
      },
      {
        test: /.(png|jpg|svg|gif)$/,
        use: [
          'cache-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              outputPath: '../public/images'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      containers: path.resolve(__dirname, '../src/containers'),
      constants: path.resolve(__dirname, '../src/constants'),
      routes: path.resolve(__dirname, '../src/routes'),
      utils: path.resolve(__dirname, '../src/utils'),
      md: path.resolve(__dirname, '../src/md'),
      styles: path.resolve(__dirname, '../src/styles'),
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('index.css'), // 将css分离到/dist文件夹下的css文件夹中的index.css
    new HardSourceWebpackPlugin(),
  ]
}