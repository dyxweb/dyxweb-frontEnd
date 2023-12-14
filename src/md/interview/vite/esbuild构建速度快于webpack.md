## [esbuild构建速度快于webpack](https://juejin.cn/post/7240740177449435191)
- js是单线程串行，esbuild是新开一个进程，然后多线程并行，充分发挥多核优势。
- go是纯机器码，肯定要比JIT快。
- Esbuild选择重写包括js、ts、jsx、css等语言在内的转译工具，所以它更能保证源代码在编译步骤之间的结构一致性，比如在Webpack中使用 babel-loader 处理JavaScript 码时，可能需要经过多次如下的数据转换，源码需要经历string => AST => AST => string => AST => string，在字符串与AST之间反复横跳。而Esbuild重写大多数转译工具之后，能够在多个编译阶段共用相似的AST结构，尽可能减少字符串到AST的结构转换，提升内存使用效率。
  - Webpack 读入源码，此时为字符串形式
  - Babel 解析源码，转换为 AST 形式
  - Babel 将源码 AST 转换为低版本 AST
  - Babel 将低版本 AST generate 为低版本源码，字符串形式
  - Webpack 解析低版本源码
  - Webpack 将多个模块打包成最终产物
