/**
 * 顶部导航
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { setCookie, getCookie, delCookie } from '../../utils/cookie'
import Login from '../login';
import menuConfig from './menuConfig';
import styles from './index.less';

const mapStateToProps = state => ({
  isLogin: state.loginStore.islogin,
})
const mapDispatchToProps = dispatch => ({
  dispatch,
})

@connect(mapStateToProps, mapDispatchToProps, null, { pure:false })
@withRouter
@CSSModules(styles)
export default class Header extends Component {
  state = {
    loginVisible: false, // 注册的弹窗的显示控制
  }

  // 切换注册弹窗的显示
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
  }

  render() {
    const { location: { pathname }, isLogin } = this.props;
    const{ loginVisible } = this.state;
    const firstPath = pathname.split('/')[1];
    // 选中的顶部导航的key
    let activedTopNav = ['student', 'teacher'].includes(firstPath) ? 'trainning' : firstPath || 'blog';
    return (
      <div>
        <div styleName='header'>
          <div styleName="title"></div>
          <div styleName="main">
            <Menu mode="horizontal" selectedKeys={activedTopNav}>
              {menuConfig.map(item => (
                <Menu.Item key={item.key}>
                  <Link to={item.to}>{item.label}</Link>
                </Menu.Item> 
              ))}
            </Menu>
            {/* {isLogin ?
              <div onClick={this.logout}>logout</div> :
              <div styleName="login" onClick={this.toggleVisible}>login</div>
            } */}
          </div>
        </div>
        <Modal
          visible={loginVisible}
          footer={null}
          onCancel={this.toggleVisible}
        >
          {loginVisible && <Login colseDialogFunc={this.toggleVisible} />}
        </Modal>
      </div>
    );
  }
}
