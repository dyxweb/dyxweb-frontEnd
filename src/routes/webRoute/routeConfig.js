/**
 * 类目方法相关的路由配置
 */
import React from 'react';
// 类目数据相关方法
import Web from 'containers/web';

export default {
  allScreen: [],
  partScreen: [
    {
      exact: true,
      path: '/web/:classification/:name',
      component: Web,
    },
  ]
}