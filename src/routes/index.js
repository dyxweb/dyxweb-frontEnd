/**
 * 整体路由配置
 */
import React, { Component, Suspense } from 'react';
import CSSModules from 'react-css-modules';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import lodashGet from 'lodash.get';
import Header from 'containers/header';
import request from 'utils/request';
import { getCookie } from 'utils/cookie';
import { changePermission } from '../redux/login/actions';
import NoPermission from 'components/noPermission';
import AllLoading from 'components/allLoading';
import styles from './index.less';

const BlogRoute = React.lazy(() => import(/*  webpackChunkName: "Blog" */ './BlogRoute'));
const CategoryRoute = React.lazy(() => import(/*  webpackChunkName: "Category" */ './categoryRoute'));
const TrainningRoute = React.lazy(() => import(/*  webpackChunkName: "Trainning" */ './trainningRoute'));
const AbortRoute = React.lazy(() => import(/*  webpackChunkName: "Abort" */ './abortRoute'));
const InterviewRoute = React.lazy(() => import(/*  webpackChunkName: "Interview" */ './interviewRoute'));

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
          this.props.dispatch(changePermission(lodashGet(res, 'data') || 'normal'));
        }
      })
    }
  }

  render() {
    return (
      <Suspense fallback={<AllLoading />}>
        <div styleName="app">
          <Header />
          <div styleName="all-content" id="all-content">
            <Switch>
              <Redirect exact from="/" to="/interview" />
              {/* path属性不能去掉，匹配path才会渲染 */}
              <BlogRoute path="/blog" />
              <CategoryRoute path="/category" />
              <TrainningRoute path="/trainning" />
              <AbortRoute path="/abort" />
              <InterviewRoute path="/interview" />
              <Route exact path="/nopermission" component={NoPermission} />
              <Redirect to="/interview" />
            </Switch>
          </div>
        </div>
      </Suspense>
    )
  }
}