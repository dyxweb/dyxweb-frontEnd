/**
 * 顶部导航
 */
import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Modal, message } from 'antd';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import Login from '../login';
import menuConfig from './menuConfig';
import { delCookie } from 'utils/cookie';
import styles from './index.less';

const mapStateToProps = state => ({
  isLogin: state.loginStore.isLogin, // 是否登录
  permission: state.loginStore.permission, // 登录人的权限
})
const mapDispatchToProps = dispatch => ({
  dispatch,
})

@connect(mapStateToProps, mapDispatchToProps, null, { pure:false })
@withRouter
@CSSModules(styles)
export default class Header extends Component {
  state = {
    loginVisible: false, // 登录的弹窗的显示控制
  }

  // 切换登录弹窗的显示
  toggleVisible = () => {
    const { loginVisible } = this.state;
    this.setState({
      loginVisible: !loginVisible,
    });
  }

  // 退出登录
  logout = () => {
    this.props.dispatch({
      type: 'logout',
    });
    // 清除是否登录的缓存
    delCookie('islogin');
    delCookie('token');
    message.success('退出登录成功');
  }

  render() {
    const { location: { pathname }, isLogin, permission } = this.props;
    const{ loginVisible } = this.state;
    const firstPath = pathname.split('/')[1];
    // 选中的顶部导航的key
    let activedTopNav = ['student', 'teacher'].includes(firstPath) ? 'trainning' : firstPath || 'blog';
    // 根据权限过滤要显示的menu(没有配置权限或者设置normal权限或者配置的权限等于当前用户的权限类型表示有权限)
    const filterMenu = menuConfig.filter(item => !item.permission || item.permission === 'normal' || item.permission === permission);

    return (
      <Fragment>
        <div styleName='header'>
          <div styleName="title"></div>
          <div styleName="main">
            <Menu mode="horizontal" selectedKeys={activedTopNav}>
              {filterMenu.map(item => (
                <Menu.Item key={item.key}>
                  <Link to={item.to}>{item.label}</Link>
                </Menu.Item> 
              ))}
            </Menu>
            {isLogin ?
              <i className="iconfont icon-tuichudenglu" styleName="login" onClick={this.logout} /> :
              <i className="iconfont icon-admin" styleName="login" onClick={this.toggleVisible} />
            }
          </div>
        </div>
        <Modal
          visible={loginVisible}
          footer={null}
          onCancel={this.toggleVisible}
        >
          {loginVisible && <Login colseDialogFunc={this.toggleVisible} />}
        </Modal>
      </Fragment>
    );
  }
}
