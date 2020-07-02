/**
 * 培训相关的路由
 */
import React, { Component, Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import LeftNav from 'components/leftNav';
import AuthRouter from '../authRouter';
import routeConfig from './routeConfig';
import menuConfig from './menuConfig';

export default class TrainningRoute extends Component {
  // 渲染带有左侧导航的路由
  renderPartScreenRoute = () => {
    return (
      <Fragment>
        <LeftNav menuConfig={menuConfig} />
        <div className="right-content">
          <Switch>
            {routeConfig.partScreen.map((item, key) => (
              <AuthRouter key={key} {...item} />
            ))}
          </Switch>
        </div>
      </Fragment>
    )
  }

  render() {
    return (
      <Switch>
        <Redirect exact from="/trainning" to="/trainning/student" />
        {routeConfig.allScreen.map((item, key) => (
          <AuthRouter key={key} {...item} />
        ))}
        {this.renderPartScreenRoute()}
      </Switch>
    )
  }
}