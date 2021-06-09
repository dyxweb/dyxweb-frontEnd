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
import TodoRoute from './todoRoute';
import WebRoute from './webRoute';
import AbortRoute from './abortRoute';
import PostTestRoute from './postTestRoute';
import InterviewRoute from './interviewRoute';
import UploadFile from 'containers/uploadFile';
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
    const hiddenHeader = _.get(location, 'pathname').startsWith('/yingying'); // 隐藏顶部导航
    return (
      <div styleName="app">
        {hiddenHeader || <Header />}
        <div styleName="all-content" style={hiddenHeader ? { height: '100vh' } : {}}>
          <Switch>
            <Redirect exact from="/" to="/blog" />
            <BlogRoute path="/blog" />
            <CategoryRoute path="/category" />
            <TrainningRoute path="/trainning" />
            <TodoRoute path="/yingying" />
            <WebRoute path="/web" />
            <AbortRoute path="/abort" />
            <PostTestRoute path="/post" />
            <InterviewRoute path="/interview" />
            <Route path="/upload" component={UploadFile} />
            <Route path="/nopermission" component={NoPermission} />
          </Switch>
        </div>
      </div>
    )
  }
}