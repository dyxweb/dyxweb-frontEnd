## SSR服务端渲染
- CSR(客户端渲染)和SSR(服务端渲染)最大的区别在于前者的页面DOM是JS负责生成的，而后者是服务器端直接返回HTML。
### CSR(客户端渲染)的弊端
- 由于页面显示过程要进行JS文件拉取和通过JS向html中填充DOM，首屏加载时间会比较慢。
- 对于SEO(Search Engine Optimazition即搜索引擎优化)完全无能为力，因为搜索引擎爬虫只认识html结构的内容，而不能识别JS代码内容。