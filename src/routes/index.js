/**
 * 整体路由配置
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'containers/header';
import request from 'utils/request';
import { getCookie } from 'utils/cookie';
import { changePermission } from '../redux/login/actions';
import NoPermission from 'components/noPermission';
import BlogRoute from './blogRoute';
import CategoryRoute from './categoryRoute';
import TrainningRoute from './trainningRoute';
import styles from './index.less';

const mapStateToProps = state => ({
  isLogin: state.loginStore.isLogin, // 是否登录
})
const mapDispatchToProps = dispatch => ({
  dispatch,
})

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class App extends Component {
  // 如果保持登录状态则查询此用户的权限
  componentDidMount() {
    const { isLogin } = this.props;
    const name = getCookie("name");
    if (isLogin && name) {
      request.get(`${QUERYHOST}/getUserPermission`, { name }).then(res => {
        if (res && res.success) {
          this.props.dispatch(changePermission(_.get(res, 'data') || 'normal'));
        }
      })
    }
  }

  render() {
    return (
      <div styleName="app">
        <Header />
        <div styleName="all-content">
          <Switch>
            <Redirect exact from="/" to="/blog" />
            <BlogRoute path="/blog" />
            <CategoryRoute path="/category" />
            <TrainningRoute path="/trainning" />
            <Route path="/nopermission" component={NoPermission} />
          </Switch>
        </div>
      </div>
    )
  }
}