/**
 * 左侧导航(不是永远显示)
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;
@withRouter
export default class LeftNav extends Component {
  render() {
    const { location: { pathname }, menuConfig } = this.props;
    // 选中的左侧导航的key
    const activedLeftNav = _.get((menuConfig || []).find(item => pathname === item.key), 'key');
    return (
      <Menu
        mode="inline"
        style={{ height: "calc(100vh - 49px)", width: '256px' }}
        selectedKeys={[activedLeftNav]}
      >
        {(menuConfig || []).map(item => (
          (item.submenu || []).length > 0 ?
            <SubMenu key={item.key} title={item.label}> 
              {item.submenu.map(item => (
                <Menu.Item key={item.key}>
                  <Link to={item.key}>{item.label}</Link>
                </Menu.Item>
              ))}
            </SubMenu> :
            <Menu.Item key={item.key}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          )
        )}
      </Menu>
    );
  }
}
