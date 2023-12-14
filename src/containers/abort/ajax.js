/**
 * ajax的终止请求
 */
import React, { Component } from 'react';
import { Button } from 'antd';

export default class AbortAjax extends Component {
  state = {
    xmlhttp: '',
    res: '',
  }

  ajaxFunc = () => {
    let xmlhttp;
    if (window.XMLHttpRequest) {
      //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xmlhttp = new XMLHttpRequest();
    } else {
      // IE6, IE5 浏览器执行代码
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        this.setState({
          res: xmlhttp.responseText,
        })
      }
    }
    xmlhttp.open("GET", `${QUERYHOST}/abort?name=dyx`, true);
    xmlhttp.send();
    this.setState({
      xmlhttp,
    })
  }

  abortAjax = () => {
    // 即使前端终止请求 服务端接收到请求后还是会进行处理
    const { xmlhttp } = this.state;
    if (xmlhttp) {
      xmlhttp.abort();
    }
  }

  render() {
    const { res } = this.state;
    return (
      <div>
        <Button onClick={this.ajaxFunc}>ajax</Button>
        <Button onClick={this.abortAjax}>abort ajax</Button>
        <div>{res}</div>
      </div>
    );
  }
}
