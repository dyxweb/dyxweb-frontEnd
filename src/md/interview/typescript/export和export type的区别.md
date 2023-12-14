## export和export type的区别
> 在TypeScript中，export type和export是两种不同的导出方式，它们在不同情况下有着重要的区别。

### 导出为接口(interface)时
- export { IContext }	导出接口类型。
- export type { IContext } 导出接口类型。
- 对于纯接口两种导出方式效果相同，因为接口只存在于类型空间，没有值空间的表示。
```
interface IContext {
  userId: string;
  // ...其他属性
}
```
### 导出为类(class)时
- export { IContext }	同时导出类型和类的实现（可以用于类型注解和创建实例）。
- export type { IContext } 只导出类型部分（只能用于类型注解，不能创建实例）。
```
class IContext {
  userId: string;
  constructor(id: string) {
    this.userId = id;
  }
  
  getUserInfo() {
    return `User ID: ${this.userId}`;
  }
}
```
### 导出为枚举(enum)时
- export { IContext } 导出枚举的类型和值（可以访问枚举成员）。
- export type { IContext } 只导出枚举的类型（不能访问枚举成员）。
```
enum IContext {
  Admin = "admin",
  User = "user",
  Guest = "guest"
}
```
### 导出为类型(type)时
- export { IContext } 导出类型别名。
- export type { IContext } 导出类型别名。
- 对于类型两种导出方式效果相同，因为类型别名只存在于类型空间。
```
type IContext = {
  userId: string;
  // ...其他属性
};
```
### 实际应用建议
- 对于纯类型（接口、类型）：
  - 两种方式都可以，但使用export type更明确表示只导出类型。
- 对于同时有类型和值的声明（类、枚举）：
  - 使用export { IContext }导出完整定义（类型+值）。
  - 使用export type { IContext }仅导出类型部分。
- 重新导出时的最佳实践：
  - 如果确定只需要类型：export type { IContext } from "..."
  - 如果需要完整定义：export { IContext } from "..."
  - 如果不确定：使用export { IContext } from "..."更安全，因为它保留了所有信息。
- 使用import type的情况：
  - 当只需要类型信息时可以使用import type { IContext } from '...'，这样可以确保在编译后的JavaScript中不会包含这些导入，有助于减小打包体积。
### 总结
- 对于纯类型（接口、类型），两种方式效果相似。
- 对于有运行时值的声明（类、枚举），两种方式有显著差异。
