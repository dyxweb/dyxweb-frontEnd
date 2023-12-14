## [vite配置项](https://blog.csdn.net/mjzhang1993/article/details/122706791)
### index.html
- index.html放在项目最外层且要以type="module"的形式引入入口文件。
### 支持react
- 使用@vitejs/plugin-react插件支持react。
- @vitejs/plugin-react-refresh插件已被禁用，使用@vitejs/plugin-react插件即可。
```
yarn add @vitejs/plugin-react -D

import react from '@vitejs/plugin-react';

plugins: [
  react(),
],
```
### 开发环境使用https
- 使用server.https选项，同时使用@vitejs/plugin-basic-ssl插件。
```
yarn add @vitejs/plugin-basic-ssl -D

import ssl from '@vitejs/plugin-basic-ssl';

plugins: [
  ssl(),
],
server: {
  https: true, // 使用https
},
```
### 开发环境接口代理
```
server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'domain',
      changeOrigin: true
    },
  },
},
```
### 配置路径别名
```
resolve: {
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  alias: {
    '@': '/src'
  },
},
```
### vite默认支持热更新。
### vite默认支持区分process.env.NODE_ENV
### vite提供了对.css、.scss、.sass、.less、.styl、.stylus文件的内置支持，不需要提供额外的插件支持，但必须安装相应的预处理器依赖。
### vite提供了css modules的支持，文件名包含module后缀即可。
### 支持postcss
- vite.config.js
```
css: {
  postcss: 'postcss.config.js',
},
```
- postcss.config.js
```
yarn add postcss postcss-preset-env -D

module.exports = {
  plugins: [
    require('postcss-preset-env')()
  ]
};
```
### 代码压缩混淆
- vite默认会在生产环境下开启代码压缩和混淆功能，若要关闭该功能，可以使用build.minify选项。
```
build: {
  minify: false, // 关闭代码压缩和混淆
},
```
### 打包文件输出配置
```
build: {
  // 自定义打包输出目录
  outDir: 'build',
  rollupOptions: {
    output: {
      // 自定义入口JS文件输出路径和命名规则
      entryFileNames: 'js/[name].[hash].js',
      // 自定义分割的JS代码块输出路径和命名规则
      chunkFileNames: 'js/chunks/[name].[hash].js',
      // 自定义CSS文件和其它静态资源输出路径和命名规则
      assetFileNames: (assetInfo) => {
        let extType = assetInfo.name?.split('.').at(-1);
        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
          extType = 'img';
        }
        if (extType === 'css') {
          return 'css/[name].[hash].[ext]';
        }
        return `${extType}/[name].[hash].[ext]`;
      },
      // 手动配置代码分割
      manualChunks(id) {
        // 将所有node_modules中的模块打包到vendor.js
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      }
    },
  },
}
```
### 配置gzip压缩
- 使用vite-plugin-compression插件支持gzip压缩。
```
yarn add vite-plugin-compression -D

import viteCompression from 'vite-plugin-compression';

plugins: [
  viteCompression({
    verbose: true,
    disable: false,
    threshold: 10240,
    algorithm: 'gzip',
    ext: '.gz',
  }),
],
```


