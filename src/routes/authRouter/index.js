/**
 * 高阶组件用于判断是否登录
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

const mapStateToProps = () => ({});

@withRouter
@connect(mapStateToProps,null)
export default class AuthRouter extends Component {
  render() {
    const isLogged = true;
    // 判断是否登录
    if(isLogged) {
      return <Route {...this.props}/>;
    } else {
      return <Redirect to="/login" />;
    }
  }
}