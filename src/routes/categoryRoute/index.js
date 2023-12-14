/**
 * 类目方法相关的路由
 */
import React, { Component, Fragment } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RenderPartRoute from 'components/renderPartRoute';
import AuthRoute from '../authRoute';
import routeConfig from './routeConfig';
import menuConfig from './menuConfig';

export default class CategoryRoute extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/category" to="/category/func/generateTree" />
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
        <Redirect to="/category" />
      </Switch>
    )
  }
}