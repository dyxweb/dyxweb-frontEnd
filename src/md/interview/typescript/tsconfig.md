## tsconfig.json文件
> tsconfig.json文件是用于描述将TypeScript转为JavaScript代码的配置文件。

- IDE(代码编辑器)将会根据tsconfig.json文件对当前项目中支持不同程度的类型约束。
- 对TSC编译TypeScript代码过程做一些预定义、约束入口和编译输出目录等配置。
### tsconfig.json配置详解
- files：用于指明需要tsc编译的一个或多个ts文件。
```
{
  "files": [
    "index.ts",
    "global.d.ts"
  ],
}
```
- include：用于指明需要被tsc编译的文件或文件夹列表。
```
{
  "include": [
    "src",
    "global.d.ts"
  ],
}
```
- exclude：用于排除不需要tsc编译的文件或文件夹列表。exclude字段中的声明只对include字段有排除效果，对files字段无影响，即与include字段中的值互斥。如果tsconfig.json文件中files和include字段都不存在，则默认包含tsconfig.json文件所在目录及子目录的所有文件，且排除在exclude字段中声明的文件或文件夹。
```
{
  "exclude": [
    "test.ts",
    "src/test.ts"
  ],
}
```
- compileOnSave：声明是否需要在保存时候自动触发tsc编译。
```
{
  "compileOnSave": false,
}
```
- extends：指定继承已有的tsconfig配置规则文件。
```
{
  "extends": "../../tsconfig.json",
}
```
### compilerOptions
> compilerOptions是描述TypeScript编译功能的大字段，其值类型是对象，包含了很多用于描述编译器功能的子字段。

- target：指定经过TSC编译后代码的ECMAScript版本。
```
{
  "compilerOptions": {
    "target": "es5",
  }
}
```
- lib：编译过程中需要引入的库文件的列表。例如我们的代码会使用到浏览器中的一些对象window、document，这些全局对象API对于TypeScript Complier来说是不能识别的。显式引入相关库TS在运行时以及编译时就不会报类型错误。
```
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
  }
}
```
- module：指定编译后得到的JS代码采取哪种模块管理方式，module负责的是模块管理方式，不负责js语法版本，js语法版本是由target字段管理的。
  1. CommonJS：生成的代码使用require/module.exports模块管理方式。
  2. ESNext、ES2020：生成的代码使用import/export模块管理方式。
  3. NodeNext：要看package.json的type字段，如果是module的话生成的代码使用import/export模块管理方式，否则使用require/module.exports模块管理方式。
```
{
  "compilerOptions": {
    "module": "esnext",
  }
}
```
- moduleResolution：决定TS按照什么样的规则找到模块获取模块信息，方便编写代码时看到类型提示等等。
```
{
  "compilerOptions": {
    "moduleResolution": "node",
  }
}
```
- baseUrl：解析非相对模块名的基准目录。
```
{
  "compilerOptions": {
    "baseUrl": ".",
  }
}
```
- paths：模块名到基于baseUrl的路径映射的列表，用于简写项目中自定义模块的文件路径。需要用构建工具去落实真正路径的转化，如webpack的resolve.alias字段。
```
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
    }
  }
}

import Toast from '@/components/Toast.ts' // 模块实际位置: src/components/Toast.ts
```
- esModuleInterop：屏蔽ESModule和CommonJS之间的差异，允许从没有设置默认导出的CommonJS模块(没有默认导出内容)中默认导入，当esModuleInterop字段设置为true时候，allowSyntheticDefaultImports字段也会自动设置为true。
```
{
  "compilerOptions": {
    "esModuleInterop": true,
  }
}
```
- allowSyntheticDefaultImports：允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。允许通过import x from 'y'，即使模块y没有显式指定default导出。
```
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
  },
}
```
- rootDir：指定TS识别读取的根目录。
```
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}
```
- outDir：指定tsc编译后的输出目录。
```
{
  "compilerOptions": {
    "outDir": "./build"
  }
}
```
- jsx：指定用jsx写的代码编译为什么样的代码形式。
```
{
  "compilerOptions": {
    "jsx": "react-jsx",
  },
}
```
- importHelpers：从tslib导入辅助工具函数。
```
{
  "compilerOptions": {
    "importHelpers": true,
  },
}
```
- experimentalDecorators：启用实验性的ES装饰器。
```
{
  "compilerOptions": {
    "experimentalDecorators": true,
  },
}
```
- noEmit：不生成输出文件，设置为true时TS编译器在执行编译时不会生成任何输出文件。
```
{
  "compilerOptions": {
    "noEmit": true,
  },
}
```
- skipLibCheck：忽略所有声明文件(.d.ts)的类型检查。
```
{
  "compilerOptions": {
    "skipLibCheck": true,
  },
}
```
- allowJs：允许TS编译器编译js文件。
```
{
  "compilerOptions": {
    "allowJs": true,
  },
}
```
- strict：开启严格模式。
```
{
  "compilerOptions": {
    "strict": true,
  },
}
```
- forceConsistentCasingInFileNames：对文件名强制区分大小写。
```
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true,
  },
}
```
- noFallthroughCasesInSwitch：报告switch语句的fallthrough错误。
```
{
  "compilerOptions": {
    "noFallthroughCasesInSwitch": true,
  },
}
```
- resolveJsonModule：允许导入.json文件。
```
{
  "compilerOptions": {
    "resolveJsonModule": true,
  },
}
```
- isolatedModules；将每个文件作为单独的模块。
```
{
  "compilerOptions": {
    "isolatedModules": true,
  },
}
```
### react应用建议配置
```
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "global.d.ts"]
}
```
### Webpack + TypeScript
- 安装typescript和ts-loader两个模块，Webpack主要是依赖ts-loader实现对TypeScript语法的编译支持。
```
// webpack配置
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```
### Babel + TypeScript
- Babel处理TS需要安装@babel/preset-typescript模块，然后在babel项目配置文件中声明。
- Babel只会对TS代码转为JS代码(通过 parse TS文件为AST，并直接移除类型信息，然后输出目标代码)，不会去做TS类型检查，所以Babel编译TS文件相较于TSC的速度更快。
- 因为Babel会根据不同的兼容环境，按需引入pollyfill，比TSC直接引入core-js更优雅，因此使用了Babel打包的体积也会更小。
```
// .babelrc
{
  "presets": ["@babel/preset-typescript"]
}
```
### Rollup + TypeScript
- 添加@rollup/plugin-typescript插件，该插件会默认读取项目根目录下的tsconfig.json配置文件。
```
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript()]
};
```