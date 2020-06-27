/**
 * 博客相关的路由配置
 */
import React from 'react';
// blog列表
import BlogList from 'containers/blog/list';
// blog操作页
import BlogOperation from 'containers/blog/operation';
// blog详情页
import BlogDetail from 'containers/blog/detail';

export default {
  allScreen: [
    {
      exact: true,
      path: '/blog',
      component: BlogList,
    },
    {
      exact: true,
      path: '/blog/add',
      render: props => <BlogOperation {...props} operationType="add" />,
      routePermission: 'manager',
    },
    {
      exact: true,
      path: '/blog/:blogId/edit',
      render: props => <BlogOperation {...props} operationType='edit' />,
      routePermission: 'manager',
    },
    {
      exact: true,
      path: '/blog/:blogId/detail',
      component: BlogDetail,
    },
  ],
  partScreen: []
}