/**
 * 整体路由配置
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from 'containers/header';
import BlogRoute from './blogRoute';
import CategoryRoute from './categoryRoute';
import TrainningRoute from './trainningRoute';
import styles from './index.less';

@CSSModules(styles)
export default class App extends Component {
  render() {
    return (
      <div styleName="app">
        <Header />
        <div styleName="all-content">
          <Switch>
            <Redirect exact from="/" to="/category" />
            <Route path="/blog" component={BlogRoute} />
            <Route path="/category" component={CategoryRoute} />
            <Route path="/trainning" component={TrainningRoute} />
          </Switch>
        </div>
      </div>
    )
  }
}