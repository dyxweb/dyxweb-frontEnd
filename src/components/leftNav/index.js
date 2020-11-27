/**
 * 左侧导航(不是永远显示)
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Menu } from 'antd';
import styles from './index.less';
import CSSModules from 'react-css-modules';

const SubMenu = Menu.SubMenu;
@withRouter
@CSSModules(styles)
export default class LeftNav extends Component {
  render() {
    const { location: { pathname }, menuConfig, defaultOpenKeys } = this.props;
    // 选中的左侧导航的key
    let activedLeftNav = (menuConfig || []).find(
      item => {
        if (_.isEmpty(item.submenu)) {
          return pathname === item.key;
        } else {
          return item.submenu.find(item1 => item1.key === pathname);
        }
      }
    );

    if (_.isEmpty(activedLeftNav.submenu)) {
      activedLeftNav = activedLeftNav.key;
    } else {
      activedLeftNav = _.get(activedLeftNav.submenu.find(item1 => item1.key === pathname), 'key');
    }

    return (
      <div styleName="left-nav">
        <Menu
          mode="inline"
          selectedKeys={[activedLeftNav]}
          defaultOpenKeys={defaultOpenKeys || []}
        >
          {(menuConfig || []).map(item => (
            (item.submenu || []).length > 0 ?
              <SubMenu key={item.key} title={item.label}> 
                {item.submenu.map(item => (
                  <Menu.Item key={item.key}>
                    <Link to={item.key} title={item.label}>{item.label}</Link>
                  </Menu.Item>
                ))}
              </SubMenu> :
              <Menu.Item key={item.key}>
                <Link to={item.key} title={item.label}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </div>
    );
  }
}
