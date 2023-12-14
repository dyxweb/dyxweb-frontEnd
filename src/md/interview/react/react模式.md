## react模式
### 复合模式
- before：想更改label元素的位置, 就只能从Counter组件内部修改，但此时所有使用Counter组件的label元素位置都将发生变化。
```
import Counter from "./Counter";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>
      <Counter
        iconIncrease="+"
        iconDecrease="-"
        label="My NOT so flexible counter"
        hideLabel={false}
        hideIncrease={false}
        hideDecrease={false}
      />
    </div>
  );
}
```
- after：可以轻松选择使用哪些子组件, 也能灵活的调换子组件的位置。
  1. 创建Context和父组件，并提供子组件所需状态。
  ```
  import { createContext, useContext, useState } from "react";

  const CounterContext = createContext();

  export default function Counter({ children }) {
    const [count, setCount] = useState(0);

    const increase = () => setCount((c) => c + 1);
    const decrease = () => setCount((c) => c - 1);

    return (
      <CounterContext.Provider value={{ count, increase, decrease }}>
        <span>{children}</span>
      </CounterContext.Provider>
    );
  }
  ```
  2. 创建子组件用于实现通用功能。
  ```
  function Label({ children }) {
    return <span>{children}</span>;
  }
  function Count() {
    const { count } = useContext(CounterContext);
    return <span>{count}</span>;
  }
  function Increase({ icon }) {
    const { increase } = useContext(CounterContext);
    return <button onClick={increase}>{icon}</button>;
  }
  function Decrease({ icon }) {
    const { decrease } = useContext(CounterContext);
    return <button onClick={decrease}>{icon}</button>;
  }
  ```
  3. 将子组件作为属性添加到父组件上。
  ```
  Counter.Label = Label;
  Counter.Count = Count;
  Counter.Increase = Increase;
  Counter.Decrease = Decrease;
  ```
  4. 灵活的使用Counter组件。
  ```
  import Counter from "./Counter";

  export default function App() {
    return (
      <div>
        <h1>Compound Component Pattern</h1>
        <Counter>
          <Counter.Label>My super flexible counter</Counter.Label>
          <Counter.Decrease icon="-" />
          <Counter.Count />
          <Counter.Increase icon="+" />
        </Counter>
      </div>
    );
  }
  ```
### 高阶组件模式
- before：当有新的需求时无法更改ProductList组件，一个按钮用来控制列表是否展示；一个按钮用来控制列表折叠（只显示三条）；展示产品的标题。
```
function ProductItem({ product }) {
  return (
    <li className="product">
      <p className="product-name">{product.productName}</p>
      <p className="product-price">${product.price}</p>
      <p className="product-description">{product.description}</p>
    </li>
  );
}
// 假设该组件不可更改
function ProductList({ title, items }) {
  return (
    <ul className="list">
      {items.map((product) => (
        <ProductItem key={product.productName} product={product} />
      ))}
    </ul>
  );
}
```
- after：使用高阶组件在不修改ProductList组件的情况下完成这三个需求。
  1. 高阶组件
  ```
  import { useState } from "react";

  //高阶组件通常以 withXXX开头
  export default function withToggles(WrappedComponent) {
    return function List(props) {
      // 控制展示
      const [isOpen, setIsOpen] = useState(true);
      // 控制折叠
      const [isCollapsed, setIsCollapsed] = useState(false);

      const displayItems = isCollapsed ? props.items.slice(0, 3) : props.items;

      function toggleOpen() {
        setIsOpen((isOpen) => !isOpen);
        setIsCollapsed(false);
      }

      return (
        <div className="list-container">
          <div className="heading">
            // 展示标题
            <h2>{props.title}</h2>
            <button onClick={toggleOpen}>
              {isOpen ? <span>&or;</span> : <span>&and;</span>}
            </button>
          </div>
          {isOpen && <WrappedComponent {...props} items={displayItems} />}

          <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
            {isCollapsed ? `Show all ${props.items.length}` : "Show less"}
          </button>
        </div>
      );
    };
  }
  ```
  2. 使用高阶组件
  ```
  import withToggle from "./HOC.js";

  const ProductListWithToggles = withToggle(ProductList);
  export default function App() {
    return (
      <div>
        <h1>Render Props Demo</h1>
        <div className="col-2">
          <ProductListWithToggles
            title="ProductListWithToggle"
            items={products}
          />
        </div>
      </div>
    );
  }
  ```
### 渲染属性模式
- 复用List组件展示ProductItem和CompanyItem, 可以使用render props去代替之前的渲染逻辑。
```
function List({ title, items, render }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayItems = isCollapsed ? items.slice(0, 3) : items;

  function toggleOpen() {
    setIsOpen((isOpen) => !isOpen);
    setIsCollapsed(false);
  }

  return (
    <div className="list-container">
      <div className="heading">
        <h2>{title}</h2>
        <button onClick={toggleOpen}>
          {isOpen ? <span>&or;</span> : <span>&and;</span>}
        </button>
      </div>
      // 渲染逻辑
      {isOpen && <ul className="list">{displayItems.map(render)}</ul>}

      <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
        {isCollapsed ? `Show all ${items.length}` : "Show less"}
      </button>
    </div>
  );
}
```
- 使用时传入render属性
```
export default function App() {
  return (
    <div>
      <h1>Render Props Demo</h1>

      <div className="col-2">
        <List
          title="Products"
          items={products}
          render={(product) => (
            <ProductItem key={product.productName} product={product} />
          )}
        />
        <List
          title="CompanyItem"
          items={companies}
          render={(companie) => (
            <CompanyItem
              key={companie.companyName}
              company={companie}
              defaultVisibility={false}
            />
          )}
        />
      </div>
    </div>
  );
}
```