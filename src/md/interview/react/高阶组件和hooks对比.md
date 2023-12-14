## [高阶组件和hooks对比](https://mp.weixin.qq.com/s/P45MhphGzkrEtsSyp9GQwg)
### 属性混乱
- 高阶组件
```
const DataTableWithFeedback = compose(
  withFetch,
  withError,
  withLoading,
)(DataTable);

const App = () => {
  const url = 'https://api.mydomain/mydata';

  return (
    <DataTableWithFeedback
      url={url}
      columns={columns}
    />
  );
};
```
- 从高阶组件进出的属性都以某种方式通过黑盒子传递，需要仔细观察才能真正理解在途中生成了哪些属性，哪些属性在途中被消费，哪些属性被传递。不查看高阶组件内部逻辑不知道在这些层之间发生了什么。
```
App     withFetch   withError   withLoading   DataTable

        data->      data->      data->        data
url->   error->     error
        isLoading-> isLoading-> isLoading
```
- hooks
> 即使不清楚useFetch的实现细节，也可以清晰看到所有传入hooks的属性，以及所有从hooks中出来的属性。

```
const App = () => {
  const url = 'https://api.mydomain/mydata';
  const { data, isLoading, error } = useFetch(url);

  if (error) {
    return <div>Something went wrong ...</div>;
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
};
```
### 命名冲突
- 高阶组件
> 当使用多次高阶组件传递具有相同名称的props时会有问题，可以尝试修改高阶组件逻辑支持，但是当逻辑要求多时会是高阶组件十分复杂。

```
// withFetch高阶组件调整前
const UserWithData = compose(
  withFetch,
  withFetch,
  withError,
  withLoading,
)(User);

const App = () => {
  const userId = '1';

  return (
    <UserWithData
      url={`https://api.mydomain/user/${userId}`}
      url={`https://api.mydomain/user/${userId}/profile`}
    />
  );
};

// withFetch高阶组件调整支持传递多个urls
const UserWithData = compose(
  withFetch,
  withError,
  withLoading,
)(User);

const App = () => {
  const userId = '1';

  return (
    <UserWithData
      urls={[
        `https://api.mydomain/user/${userId}`,
        `https://api.mydomain/user/${userId}/profile`,
      ]}
    />
  );
};
```
- hooks
> 使用非常灵活，可以根据多次调用结果随意组合想要实现的逻辑。

```
const App = () => {
  const userId = '1';

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError
  } = useFetch(`https://api.mydomain/user/${userId}`);

  const {
    data: userProfileData,
    isLoading: userProfileIsLoading,
    error: userProfileError
  } = useFetch(`https://api.mydomain/user/${userId}/profile`);

  if (userError || userProfileError) {
    return <div>Something went wrong ...</div>;
  }

  if (userIsLoading) {
    return <div>User is loading ...</div>;
  }

  const userProfile = userProfileIsLoading
    ? <div>User profile is loading ...</div>
    : <UserProfile userProfile={userProfileData} />;

  return (
    <User
      user={userData}>
      userProfile={userProfile}
    />
  );
};
```
### 依赖关系
- 高阶组件
> 在两个紧密耦合的高阶组件中想要创建相互依赖的高阶组件是十分困难的。

- hooks
> 多个hooks它们可以相互依赖，如果它们彼此依赖，传递数据也是直截了当的。使用相互依赖的React Hooks时，依赖关系比使用高阶组件更加显式。

```
const App = () => {
  const userId = '1';

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError
  } = useFetch(`https://api.mydomain/user/${userId}`);

  const profileId = userData?.profileId;

  const {
    data: userProfileData,
    isLoading: userProfileIsLoading,
    error: userProfileError
  } = useFetch(`https://api.mydomain/user/${profileId}/profile`);

  if (userError || userProfileError) {
    return <div>Something went wrong ...</div>;
  }

  if (userIsLoading || userProfileIsLoading) {
    return <div>Is loading ...</div>;
  }

  return (
    <User
      user={userData}>
      userProfile={userProfileData}
    />
  );
};
```
### 嵌套层级
- 高阶组件
> 高阶组件需要实例化一个父组件来实现，加深组件嵌套层级，增加复杂度与理解成本。

- hooks
> hooks不会增加额外组件。

