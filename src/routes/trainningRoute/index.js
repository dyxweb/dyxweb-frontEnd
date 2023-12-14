/**
 * 培训相关的路由
 */
import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RenderPartRoute from 'components/renderPartRoute';
import AuthRoute from '../authRoute';
import routeConfig from './routeConfig';
import menuConfig from './menuConfig';

export default class TrainningRoute extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/trainning" to="/trainning/student" />
        {routeConfig.allScreen.map((item, key) => (
          <AuthRoute key={key} {...item} />
        ))}
        {routeConfig.partScreen.map((item, key) => (
          <AuthRoute
            key={key}
            exact={item.exact}
            path={item.path}
            routePermission={item.routePermission}
            render={(props) => <RenderPartRoute {...props} component={item.component} menuConfig={menuConfig} />}
          />
        ))}
        <Redirect to="/trainning" />
      </Switch>
    )
  }
}