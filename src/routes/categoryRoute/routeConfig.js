/**
 * 类目方法相关的路由配置
 */
import React from 'react';
// 类目数据相关方法
import CategoryFunc from 'containers/category';

export default {
  allScreen: [],
  partScreen: [
    {
      exact: true,
      path: '/category/func/:funcname',
      component: CategoryFunc,
    },
  ]
}