/**
 * 高阶组件用于判断是否有该页面的权限
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';
import AllLoading from 'components/allLoading';

const mapStateToProps = state => ({
  isLogin: state.loginStore.isLogin, // 是否登录
  permission: state.loginStore.permission, // 登录人的权限
})

@withRouter
@connect(mapStateToProps, null)
export default class AuthRoute extends Component {
  render() {
    const { routePermission, permission, isLogin } = this.props;
    // 没有配置权限或者设置normal权限或者配置的权限等于当前用户的权限类型表示有权限
    const hasPermission = !routePermission || routePermission === 'normal' || routePermission === permission;
    // 判断是否有该页面权限，无权限跳转到没有权限的页面
    if (isLogin && !permission && routePermission === 'manager') {
      return (
        <AllLoading />
      )
    }
    if(hasPermission) {
      return <Route {...this.props}/>;
    } else {
      return <Redirect to="/nopermission" />;
    }
  }
}