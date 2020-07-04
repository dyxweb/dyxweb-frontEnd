/**
 * 博客相关的路由
 */
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import LeftNav from 'components/leftNav';
import AuthRouter from '../authRouter';
import routeConfig from './routeConfig';
import menuConfig from './menuConfig';

export default class BlogRoute extends Component {
  // 渲染带有左侧导航的路由
  renderPartScreenRoute = () => {
    return (
      <div className="all-content">
        <LeftNav menuConfig={menuConfig} />
        <div className="right-content">
          <Switch>
            {routeConfig.partScreen.map((item, key) => (
              <AuthRouter key={key} {...item} />
            ))}
          </Switch>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Switch>
        {routeConfig.allScreen.map((item, key) => (
          <AuthRouter key={key} {...item} />
        ))}
        {this.renderPartScreenRoute()}
      </Switch>
    )
  }
}