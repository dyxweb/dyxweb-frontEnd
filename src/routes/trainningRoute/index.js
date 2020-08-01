/**
 * 培训相关的路由
 */
import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import LeftNav from 'components/leftNav';
import AuthRoute from '../authRoute';
import routeConfig from './routeConfig';
import menuConfig from './menuConfig';

export default class TrainningRoute extends Component {
  // 渲染带有左侧导航的路由
  renderPartScreenRoute = () => {
    return (
      <div className="all-content">
        <LeftNav menuConfig={menuConfig} />
        <div className="right-content">
          <Switch>
            {routeConfig.partScreen.map((item, key) => (
              <AuthRoute key={key} {...item} />
            ))}
          </Switch>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Switch>
        <Redirect exact from="/trainning" to="/trainning/student" />
        {routeConfig.allScreen.map((item, key) => (
          <AuthRoute key={key} {...item} />
        ))}
        {this.renderPartScreenRoute()}
      </Switch>
    )
  }
}