## pnpm-monorepo
1. 在根目录pnpm初始化生成package.json。
```
pnpm init
```
2. 配置工作空间，根目录新建pnpm-workspace.yaml文件。
```
packages:
  # web应用程序目录
  - 'applications/**'
  # 通用程序目录
  - 'packages/**'
```
3. 安装项目依赖，在根目录运行如下命令，一键为所有项目安装依赖。
```
pnpm i
```
### pnpm命令
- 执行admin-user项目命令
```
pnpm -F admin-user start
pnpm -F admin-user build
```
- 安装外部模块依赖
```
pnpm -F utils add -S lodash
pnpm -F utils add -D webpack
```
- 安装其它模块依赖
```
pnpm -F admin-user add utils --workspace
```
- 删除模块依赖
```
pnpm -F utils remove lodash
pnpm -F utils remove webpack
```