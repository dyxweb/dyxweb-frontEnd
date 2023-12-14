/**
 * 待办相关的路由配置
 */
import React from 'react';
import AbortAjax from 'containers/Abort/ajax';
import AbortAxios from 'containers/Abort/axios';

export default {
  allScreen: [
    {
      exact: true,
      path: '/abort/ajax',
      component: AbortAjax,
    },
    {
      exact: true,
      path: '/abort/axios',
      component: AbortAxios,
    },
  ],
  partScreen: []
}