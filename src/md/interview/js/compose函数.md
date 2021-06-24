## compose函数
> 把逻辑解耦在各个函数中,通过compose的方式组合函数, 将外部数据依次通过各个函数的加工,生成结果。先执行后传入的函数。

### redux源码中的中间件的处理使用的函数
```
function compose(...funcs) {
	if (funcs.length === 0) {
		return arg => arg
	}

	if (funcs.length === 1) {
		return funcs[0]
	}
	
	return funcs.reduce((a, b) => (...args) => a(b(...args)))
} 
```

### demo
```
let a = x => x + "。";
let b = x => x + "!";
let c = x => x + "?";
let combineFun = compose(a, b, c)
combineFun('dyx') // dyx?!。
```

### 洋葱圈模型
> 通过以上的组合函数使传入的中间件函数变成(...arg) => mid1(mid2(mid3(...arg)))，最后执行的中间件mid3最先执行完，最先执行的mid1最后执行完，是符合洋葱圈模型的。