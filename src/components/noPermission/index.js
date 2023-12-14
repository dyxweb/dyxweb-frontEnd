/**
 * 没有权限时的跳转中转页面
 */
import React, { Component } from 'react';
import styles from './index.less';
import CSSModules from 'react-css-modules';

@CSSModules(styles)
export default class NoPermission extends Component {
  constructor() {
    super();
    this.state = {
      second: 3, // 倒计时秒数跳转
    }
    this.timer = null; // 定时器使用
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((preState) =>({
        second: preState.second - 1,
      }), () => {
        if (this.state.second === 0) {
          this.timer && clearInterval(this.timer);
          this.props.history.push('/category');
        }
      });
    }, 1000)
  }

  componentWillUnmount () {
    this.timer && clearInterval(this.timer);
  }

  render() {
    const { second } = this.state;
    return (
      <div styleName="no-permission">
        {`您暂未此页面权限，请登录后再访问，页面将于${second}秒后跳转到类目方法页面。`}
      </div>
    )
  }
}