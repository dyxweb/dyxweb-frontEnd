## next.js
### 入口文件
- pages route：src/pages/_app.ts
- app route：src/app/layout.tsx
### 路由
- 路由到/demo时，src/pages/demo/index.tsx(pages route)和src/app/demo/page.tsx(app route)都会被匹配到，所以这两个文件不能同时存在。目前版本的nextjs中pages和app这两个目录一般不会同时存在。
- 如果定义了src/app/demo/abc.tsx，你没法通过/demo/abc路由到它(app route下定义src/app/demo/abc/page.tsx可以通过路由访问到)，但如果你定义src/pages/demo/abc.tsx就可以。

### 使用next/navigation时提示找不到类型声明
- 安装@types/next依赖
- [修改tsconfig.json文件](https://github.com/vercel/next.js/blob/canary/examples/hello-world/tsconfig.json)
### 使用路由
- 添加"use client" (必须)
- 使用useRouter (app route使用next/navigation，不使用next/router)
```
import { useRouter } from 'next/navigation';

const router = useRouter();
```
- 路由跳转
```
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/');
router.replace('/');
router.back();
```
- 获取路由动态参数
```
import { useParams } from 'next/navigation';

const params = useParams();
console.log(params)
```
- 获取pathname
```
import { usePathname } from 'next/navigation';
 
const pathname = usePathname();
console.log(pathname)
```
- 获取路由搜索参数
```
import { useSearchParams } from 'next/navigation';
 
const searchParams = useSearchParams();
const search = searchParams.get('search');
```
### 启动本地服务
- npm run dev
### 部署生产环境服务
- npm run build：打包后的内容在.next目录下
- npm run start：启动node服务
