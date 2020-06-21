const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: "bundle.js"
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
        use: ['cache-loader', 'style-loader', 'css-loader', 'postcss-loader'] // 需要用的loader，确定的顺序，调用loader是从右往左编译的
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
  ]
}