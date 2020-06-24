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
import styles from './index.less';

const mapStateToProps = state => ({
  isLogin: state.loginStore.islogin, // 是否登录
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
    message.success('退出登录成功');
  }

  render() {
    const { location: { pathname }, isLogin, permission } = this.props;
    const{ loginVisible } = this.state;
    const firstPath = pathname.split('/')[1];
    // 选中的顶部导航的key
    let activedTopNav = ['student', 'teacher'].includes(firstPath) ? 'trainning' : firstPath || 'blog';
    // 根据权限过滤要显示的menu
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
              <div onClick={this.logout} styleName="logout" >logout</div> :
              <i className="iconfont icon-admin" onClick={this.toggleVisible} styleName="login" />
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
