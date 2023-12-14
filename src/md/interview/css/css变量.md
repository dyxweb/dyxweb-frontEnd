## css变量
### css变量有全局作用域和非全局作用域。
- 使用:root或html、body标签定义的css变量是全局享用的。
```
:root {
  --color: red;
}

body {
  --color: red;
}
```
- 设置在特定元素或样式类上的css变量，只能在该元素及其子元素上生效。且优先级高于全局设置的css变量。
```
.box {
  --color: yellow;
}
```
