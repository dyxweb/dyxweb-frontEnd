const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
        use: ['raw-loader'],
      },
      {
        test: /.(png|jpg|svg|gif)$/,
        use: [
          'cache-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              outputPath: '../docs/images'
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
    new ExtractTextPlugin('index.css'), // 将css分离到/docs文件夹下的css文件夹中的index.css
    new HardSourceWebpackPlugin({
      cachePrune: {
        sizeThreshold: 300 * 1024 * 1024, // 总缓存文件大于300M时才会自动删除过时的缓存文件
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: path.join(__dirname, "../template/index.html") // 配置文件模板
    })
  ]
}