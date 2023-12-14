/**
 * 渲染有左侧导航的路由组件
 */
import React from 'react';
import { isPC } from 'utils/common';
import LeftNav from '../leftNav';

// 渲染带有左侧导航的路由
const RenderPartScreenRoute = ({ component: Com, menuConfig, defaultOpenKeys = [], hiddenLeftNav, ...rest }) => {
  const isHiddenLeftNav = !isPC() && hiddenLeftNav;
  return (
    <div className="all-content">
      {/* 移动端访问interview不显示左侧导航 */}
      {isHiddenLeftNav || <LeftNav menuConfig={menuConfig} defaultOpenKeys={defaultOpenKeys} />}
      <div className="right-content">
        <Com {...rest} />
      </div>
    </div>
  )
}

export default RenderPartScreenRoute;