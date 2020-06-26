/**
 * 培训相关路由配置
 */
import React from 'react';
// 学生列表
import StudentList from 'containers/student/list';
// 学生操作页
import StudentOperation from 'containers/student/operation';
// 教师列表
import TeacherList from 'containers/teacher/list';
// 教师操作页
import TeacherOperation from 'containers/teacher/operation';

export default {
  allScreen: [
    {
      exact: true,
      path: '/trainning/student/add',
      render: props => <StudentOperation {...props} operationType='add' />,
      routePermission: 'manager',
    },
    {
      exact: true,
      path: '/trainning/student/:studentId/edit',
      render: props => <StudentOperation {...props} operationType='edit' />,
      routePermission: 'manager',
    },
    {
      exact: true,
      path: '/trainning/teacher/add',
      render: props => <TeacherOperation {...props} operationType='add' />,
      routePermission: 'manager',
    },
    {
      exact: true,
      path: '/trainning/teacher/:teacherId/edit',
      render: props => <TeacherOperation {...props} operationType='edit' />,
      routePermission: 'manager',
    },
  ],
  partScreen: [
    {
      exact: true,
      path: '/trainning/student',
      component: StudentList,
      routePermission: 'manager',
    },
    {
      exact: true,
      path: '/trainning/teacher',
      component: TeacherList,
      routePermission: 'manager',
    },
  ]
}