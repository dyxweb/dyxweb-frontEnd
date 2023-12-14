## next.js
- 静态生成：HTML是在构建时生成，并重用于每个页面请求。服务器端渲染：HTML是在每个页面请求时生成的。
- app/layout.tsx是一个特殊的文件，定义了整个项目的布局。
- next.js默认支持css同时也支持.module.css的样式隔离。
- 图片渲染可以使用next.js提供的组件 import Image from 'next/image'
- js引入可以使用next.js提供的组件 import Script from 'next/script'
- 不加nostore时 获取到的数据是过去的数据
- next.js默认都是服务端组件，不能使用useEffect等客户端特性
- 构建时预渲染页面(SSG)和请求时渲染页面(SSR)
### next.js的pages使用
- app目录等同于pages目录，app目录下的page.tsx文件就相当于根路由。
- 在app目录下添加新目录，新目录下新建page.tsx(文件名必须是page)文件，新目录的名称就是访问的路由。
### Pages Router => App Router
> 过去将页面放置在pages目录下，后来Next.js 13推出了新的App Router，将页面放置在app目录下。

- 应用中的每个页面都有自己的目录，目录名称定义URL路径。
- 浏览器中访问路径时渲染的组件是page.js。
- 可以将其他组件存储在路径的目录中，如果它们没有命名为page.js，则不会影响路由。
- 每个页面的目录中可以放置几个具有保留名称的文件，它们都具有特定的功能。例如loading.js、template.js和layout.js。
- 每个页面都可以有一个Layout.tsx的布局文件，但是不需要每个页面都设置，如果页面文件夹下有Layout.tsx文件才会走页面的Layout布局。如果页面的上一级设置了Layout布局，则会在上一次布局的基础上再嵌套一个Layout布局。
- 在App目录下创建(name)以括号的形式命名的文件目录，该文件不会作为路由。带括号的文件夹虽然不会被渲染成路由，但是同样也是拥有和页面一样的目录组成，可以给()文件夹单独设置layout.tsx和loading.tsx以及error.tsx文件夹，这样在()号目录文件夹下的全部具有就会有layout布局。https://article.juejin.cn/post/7247058712194695224
- 过去目录
```
└── pages
  ├── about.js
  ├── index.js
  └── team.js
```
- 现在目录
```
src/
└── app
  ├── page.js 
  ├── about
  │ └── page.js
  ├── login
  │ └── page.js
  ├── globals.css
  ├── layout.js
```
### TODO
- revalidate的ISR
- getStaticPaths的fallback
- getServerSideProps的notFound和redirect
- revalidatePath的作用，Calling revalidatePath to clear the client cache and make a new server request.
- 直接在组件中获取数据和通过提供的API映射到props的区别