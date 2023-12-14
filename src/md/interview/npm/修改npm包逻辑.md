## 修改npm包逻辑
- 直接修改node_modules中npm包代码这种做法是不推荐的，因为这些改动在重新安装包或更新包时会丢失。
### Fork源代码
- Fork第三方包的源代码库，对其源代码进行修改，修改完成后将修改后的包发布到npm上，然后将项目中的包切换为修改后的npm包。
### 提交PR
- 如果新的修改对其他用户也有帮助，可以向原始包的维护者提交Pull Request，如果PR被接受并合并，那么就可以直接使用未来版本的官方包。
### 本地修改生成补丁
1. 直接在项目的node_modules目录下找到并修改对应的第三方包文件，虽然这种修改是临时的，但是接下来的步骤会保存这些改动。
2. 使用patch-package在node_modules中的包上应用补丁，并且这些补丁可以和项目代码一起被版本控制。
```
npm install patch-package postinstall-postinstall --save-dev
```
3. 使用patch-package生成一个补丁文件。这个命令会比较node_modules中对应npm包的修改，并将这些修改保存为一个补丁文件。执行这个命令后patch-package会在项目的根目录下创建一个patches目录，并在里面生成一个名为npm包名称+版本号.patch的文件，版本号是项目中使用的npm包的版本。
```
npx patch-package packageName
```
4. 将应用补丁的步骤添加到package.json中的script字段，每次运行npm install时postinstall脚本都会执行，自动应用保存在patches/目录下的所有补丁。
```
"scripts": {
  "postinstall": "patch-package"
}
```
### 包装第三方包
- 包装第三方包方法创建一个新的模块或包，通过这种方式可以在不直接修改原始包的情况下，添加新的功能、修改现有方法或者调整方法的行为。
