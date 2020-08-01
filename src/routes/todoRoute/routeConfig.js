/**
 * 待办相关的路由配置
 */
import React from 'react';
import HerTodo from 'containers/HerTodo';
import OperationHerTodo from 'containers/HerTodo/operation';

export default {
  allScreen: [
    {
      exact: true,
      path: '/yingying',
      component: HerTodo,
    },
    {
      exact: true,
      path: '/yingying/add',
      render: props => <OperationHerTodo {...props} operationType="add" />,
    },
    {
      exact: true,
      path: '/yingying/:todoId/edit',
      render: props => <BlogOperation {...props} operationType='edit' />,
      routePermission: 'manager',
    },
  ],
  partScreen: []
}