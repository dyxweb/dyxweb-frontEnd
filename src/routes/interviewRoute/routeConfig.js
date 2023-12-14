/**
 * 面试技术点相关的路由配置
 */
import React from 'react';
import Interview from 'containers/interview'

export default {
  allScreen: [],
  partScreen: [
    {
      exact: true,
      path: '/interview/:classification/:name',
      component: Interview,
    },
  ]
}