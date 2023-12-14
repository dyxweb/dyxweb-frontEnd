## antd v5实现主题切换
### 通过ConfigProvider实现预设算法(algorithm)的主题切换
- app.tsx
```
import { IntlProvider } from 'react-intl';
import { ConfigProvider, theme } from 'antd';
import { getLocale } from '@/locale';
import configStore from '@/store/configStore';
import Routes from '@/routes';
import Message from '@/components/message';

const App = () => {
  // 获取语言环境
  const { locale: currentLocale, selectedTheme } = configStore(
    (state: any) => state
  );
  const { locale, antLocale, messages } = getLocale(currentLocale);

  const themeAlgorithms = [];
  if (selectedTheme.includes('dark')) {
    themeAlgorithms.push(theme.darkAlgorithm);
  }
  if (selectedTheme.includes('compact')) {
    themeAlgorithms.push(theme.compactAlgorithm);
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      <ConfigProvider
        locale={antLocale}
        theme={{
          cssVar: true,
          hashed: false,
          algorithm: themeAlgorithms
        }}
      >
        <Routes />
        <Message />
      </ConfigProvider>
    </IntlProvider>
  );
};

export default App;
```
### 业务代码中的样式使用antd提供的样式变量
- variables.scss文件中定义scss变量，方便全局管理。
```
$primaryColor: var(--ant-color-primary, #1677ff); // 主题色(hover时、链接也使用此颜色)
$successColor: var(--ant-color-success, #52c41a); // 成功色
$warningColor: var(--ant-color-warning, #faad14); // 警戒色
$errorColor: var(--ant-color-error, #ff4d4f); // 错误色
$whiteColor: var(--ant-color-bg-base, #fff); // 白色
$blackColor: var(--ant-color-text-base, #000); // 黑色
$redColor: var(--ant-red, #f5222d); // 红色
$backColor: var(--ant-color-bg-layout, #f5f5f5); // 背景色
$tableBackColor: var(--ant-table-header-bg, #fafafa); // 表格背景色
$borderColor: var(--ant-color-border-secondary, #f0f0f0); // 边框颜色
$cardBorderRadius: var(--ant-border-radius-lg, 8px); // 卡片圆角
$buttonSpacing: 8px; // 按钮之间的间距
$textButtonSpacing: 4px; // 文字形式按钮之间的间距
:export {
  primaryColor: $primaryColor;
  successColor: $successColor;
  warningColor: $warningColor;
  errorColor: $errorColor;
  whiteColor: $whiteColor;
  blackColor: $blackColor;
  redColor: $redColor;
  cardBorderRadius: $cardBorderRadius;
  buttonSpacing: $buttonSpacing;
  textButtonSpacing: $textButtonSpacing;
  backColor: $backColor;
  borderColor: $borderColor;
}
```
- 业务代码中使用scss变量。
```
.spaceBetweenPageInnerContentBox {
  height: 100%;
  border-radius: $cardBorderRadius;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: $whiteColor;
  .tipBox {
    border-top: 1px solid $borderColor;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tableBox {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
}
```
- 如果使用antd非全局的css变量，比如table组件的--ant-table-header-bg变量，需要额外添加table组件的样式类。
```
<div className={`${styles.filterColumn} css-var-r0 ant-table-css-var`}>
  ...
</div>

.filterColumn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $tableBackColor;
  flex-shrink: 0;
  padding: 6px;
}
```
### ConfigProvider对message.xxx、Modal.xxx、notification.xxx等静态方法不会生效。
#### JSX组件中使用
- 使用hooks形式方法手动植入contextHolder。
```
import React from 'react';
import { Button, message } from 'antd';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info('Hello, Ant Design!');
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display normal message
      </Button>
    </>
  );
};
```

- 可以通过App包裹组件简化手动植入contextHolder的问题。
```
// Sub page
import React from 'react';
import { App } from 'antd';

const MyPage = () => {
  const { message } = App.useApp();

  const showMessage = () => {
    message.success('Success!');
  };
}

// Entry component
export default () => (
  <App>
    <MyPage />
  </App>
);
```
#### JSX组件外部使用
- 在入口组件将App.useApp返回的message对象存储到redux的store中，使用时从store中获取message对象。
- [通过自定义事件实现message对象。](https://www.wenyisong.cn/js/antd-message-global/)
  1. 实现Message组件。
  ```
  import { useEffect } from 'react';
  import { message } from 'antd';
  import { MESSAGE_EVENT_NAME } from '@/utils/antdMessage';

  const Message = () => {
    const [api, contextHolder] = message.useMessage();

    useEffect(() => {
      const bindEvent = (e: CustomEvent | any) => {
        const func: 'success' | 'error' | 'info' | 'warning' | 'loading' =
          e?.detail?.type || 'info';
        const { content, duration, onClose } = e.detail?.params || {};
        api[func](content, duration, onClose);
      };
      window.addEventListener(MESSAGE_EVENT_NAME, bindEvent);
      return () => {
        window.removeEventListener(MESSAGE_EVENT_NAME, bindEvent);
      };
    }, [api]);

    return <>{contextHolder}</>;
  };

  export default Message;
  ```
  2. 挂载Message组件到App组件。
  ```
  import { IntlProvider } from 'react-intl';
  import { ConfigProvider, theme } from 'antd';
  import { getLocale } from '@/locale';
  import configStore from '@/store/configStore';
  import Routes from '@/routes';
  import Message from '@/components/message';

  const App = () => {
    // 获取语言环境
    const { locale: currentLocale, selectedTheme } = configStore(
      (state: any) => state
    );
    const { locale, antLocale, messages } = getLocale(currentLocale);

    const themeAlgorithms = [];
    if (selectedTheme.includes('dark')) {
      themeAlgorithms.push(theme.darkAlgorithm);
    }
    if (selectedTheme.includes('compact')) {
      themeAlgorithms.push(theme.compactAlgorithm);
    }

    return (
      <IntlProvider locale={locale} messages={messages}>
        <ConfigProvider
          locale={antLocale}
          theme={{
            cssVar: true,
            hashed: false,
            algorithm: themeAlgorithms
          }}
        >
          <Routes />
          <Message />
        </ConfigProvider>
      </IntlProvider>
    );
  };

  export default App;
  ```
  3. 暴露message方法。
  ```
  import { JointContent } from 'antd/es/message/interface';

  export const MESSAGE_EVENT_NAME = 'mock_antd_message';
  export enum MESSAGE_TYPES {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning',
    LOADING = 'loading'
  }

  const dispatch = (
    type: MESSAGE_TYPES,
    content: JointContent,
    duration?: number | VoidFunction,
    onClose?: VoidFunction
  ) => {
    window.dispatchEvent(
      new CustomEvent(MESSAGE_EVENT_NAME, {
        detail: {
          params: {
            content,
            duration,
            onClose
          },
          type: type
        }
      })
    );
  };

  export const message = {
    success(
      content: JointContent,
      duration?: number | VoidFunction,
      onClose?: VoidFunction
    ) {
      dispatch(MESSAGE_TYPES.SUCCESS, content, duration, onClose);
    },
    error(
      content: JointContent,
      duration?: number | VoidFunction,
      onClose?: VoidFunction
    ) {
      dispatch(MESSAGE_TYPES.ERROR, content, duration, onClose);
    },
    info(
      content: JointContent,
      duration?: number | VoidFunction,
      onClose?: VoidFunction
    ) {
      dispatch(MESSAGE_TYPES.INFO, content, duration, onClose);
    },
    warning(
      content: JointContent,
      duration?: number | VoidFunction,
      onClose?: VoidFunction
    ) {
      dispatch(MESSAGE_TYPES.WARNING, content, duration, onClose);
    },
    loading(
      content: JointContent,
      duration?: number | VoidFunction,
      onClose?: VoidFunction
    ) {
      dispatch(MESSAGE_TYPES.LOADING, content, duration, onClose);
    }
  };
  ```
  4. 在业务代码中使用message对象。
  ```
  import { message } from '@/utils/antdMessage';

  message.error('请上传正确格式文件');
  ```
