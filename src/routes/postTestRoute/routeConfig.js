/**
 * post请求相关的路由配置
 */
import React from 'react';
import PostTest from 'containers/postTest/test';
import PostAxios from 'containers/postTest/axios';

export default {
  allScreen: [
    {
      exact: true,
      path: '/post/test',
      component: PostTest,
    },
    {
      exact: true,
      path: '/post/axios',
      component: PostAxios,
    },
  ],
  partScreen: []
}