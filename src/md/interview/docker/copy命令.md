## copy命令
> copy命令用于将文件或目录复制到Docker镜像中。

```
COPY [--chown=<user>:<group>] <源路径> <目标路径>
```
### WORKDIR命令
> WORKDIR命令用于设置工作目录，也是后续的RUN、CMD、ENTRYPOINT、COPY、ADD命令执行时所在的目录。

### 目标路径使用./
- .表示当前工作目录，/表示根目录，./表示当前工作目录的相对路径。
- 将当前构建上下文中的package.json文件复制到镜像的/home目录，./表示复制到当前工作目录，也就是/home目录。
```
WORKDIR /home
COPY package.json ./
```
### 相对路基
- ./表示当前所在的目录。
- ../表示上一层目录。
- /表示根目录。