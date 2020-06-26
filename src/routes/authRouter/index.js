/**
 * 高阶组件用于判断是否有该页面的权限
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

const mapStateToProps = state => ({
  permission: state.loginStore.permission, // 登录人的权限
})

@withRouter
@connect(mapStateToProps, null)
export default class AuthRouter extends Component {
  render() {
    const { routePermission,  permission } = this.props;
    // 没有配置权限或者设置normal权限或者配置的权限等于当前用户的权限类型表示有权限
    const hasPermission = !routePermission || routePermission === 'normal' || routePermission === permission;
    // 判断是否有该页面权限，无权限跳转到category页面
    if(hasPermission) {
      return <Route {...this.props}/>;
    } else {
      return <Redirect to="/category" />;
    }
  }
}