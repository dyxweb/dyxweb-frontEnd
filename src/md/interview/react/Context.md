## Context
- React Context API是React库的一部分，它允许在组件之间共享全局数据，而无需通过每层组件传递props。使用Context API可以避免繁琐的props传递，提高代码的可读性和维护性。
- Context API非常适合需要在多个嵌套组件中共享状态的场景，例如管理全局主题设置、用户身份验证状态或应用配置等。
- 当Context的值在顶部组件使用state维护时，更新state使Context的值变化，会导致顶部组件和内部所有后代组件重新渲染，此种情况相较于通过每层组件传递props并无法减少中间组件的重新渲染。
### Context使用
- 使用createContext创建Context。
```
import { createContext } from 'react';

const ThemeContext = createContext('light'); // 默认值
```
- 使用Provider指定包裹组件的值。
```
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```
- 使用useContext()读取Context值。
```
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```
### 创建多个React Context
- 每当Context的值更新时，使用该Context的所有组件都会重新渲染。当更新Context中部分信息时，使用Context但并不关注此次更新信息的组件也会重新渲染。
- 创建多个Context将不同部分的信息使用不同的Context存储。
```
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```
### 如何防止React Context重新渲染问题
> 每当更新Context值时，所有使用该上下文的组件都将被重新渲染(即使组件被React.memo包裹)。

- 使用多个React Context
> 这是防止不必要重新渲染的首选方法。通过创建多个Context将相关的数据分开存储，只有使用特定Context的组件会因更新而重新渲染。

- 拆分组件并传递所需的值(使用单一React Context情景)
> 通过将组件拆分，并将所需的值作为props从context中传递，并将子组件包装在React.memo中，只有当其props发生变化时，组件才会重新渲染。

```
const Card = () => {
  const appContextValue = useContext(AppContext);
  const theme = appContextValue.theme;

  return (
    <div>
      <CardTitle theme={theme} />
      <CardDescription theme={theme} />
    </div>
  );
};

const CardTitle = React.memo(({ theme }) => {
  return <h2 style={{ color: theme.text }}>title</h2>;
});

const CardDescription = React.memo(({ theme }) => {
  return <p style={{ color: theme.text }}>description</p>;
});
```
- 使用React.useMemo(使用单一React Context情景)
> 将组件包装在useMemo中，并将Context的值作为依赖项，只有Context的值更改时才会触发回调函数重新渲染组件。

```
const Card = () => {
  const appContextValue = useContext(AppContext);
  const theme = appContextValue.theme;

  return useMemo(
    () => (
      <div>
        <CardTitle theme={theme} />
        <CardDescription theme={theme} />
      </div>
    ),
    [theme]
  );
};

const CardTitle = ({ theme }) => {
  return <h2 style={{ color: theme.text }}>title</h2>;
};

const CardDescription = ({ theme }) => {
  return <p style={{ color: theme.text }}>description</p>;
};
```
