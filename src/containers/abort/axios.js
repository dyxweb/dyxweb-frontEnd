/**
 * axios的终止请求
 */
import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';

export default class AbortAxios extends Component {
  state = {
    axiosReq: '',
    res: {},
  }

  axiosFunc = () => {
    const cancelToken = axios.CancelToken
    const source = cancelToken.source()
    axios.get(`${QUERYHOST}/abort?name=dyx`, {
      cancelToken: source.token,
    }).then(response => {
      this.setState({
        res: response.data
      })
    }).catch(error => {
      // 取消会有error信息
      console.log(error);
    });
    this.setState({
      axiosReq: source,
    })
  }

  abortAxios = () => {
    // 即使前端终止请求 服务端接收到请求后还是会进行处理
    const { axiosReq } = this.state;
    if (axiosReq) {
      axiosReq.cancel();
    }
  }
  render() {
    const { res } = this.state;
    return (
      <div>
        <Button onClick={this.axiosFunc}>axios</Button>
        <Button onClick={this.abortAxios}>abort axios</Button>
        <div>{res && res.name}</div>
      </div>
    );
  }
}
