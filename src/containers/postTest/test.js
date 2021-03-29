/**
 * post请求json形式
 */
import React, { Component } from 'react';
import axios from 'axios'

export default class PostTestJson extends Component {
  fetchJson = () => {
    const params = { name: 'dyx', age: [1, 2, 3]}
    fetch(`${QUERYHOST}/postTest`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: {
        'content-type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
    })
  }

  axiosJson = () => {
    const params = { name: 'dyx', age: [1, 2, 3]}
    axios.post(`${QUERYHOST}/postTest`, params)
    .then((response) => console.log(response))
  }

  // 入参formData(数组解析成逗号连接的形式)  服务端egg需要特殊解析
  fetchForm = () => {
    const formData = new FormData()
    formData.append('name', 'dyx')
    formData.append('age', [1, 2, 3])
    fetch(`${QUERYHOST}/postTest`, {
      method: 'post',
      body: formData,
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
    })
  }

  // 入参formData(数组解析成逗号连接的形式)  服务端egg需要特殊解析
  axiosForm = () => {
    const formData = new FormData()
    formData.append('name', 'dyx')
    formData.append('age', [1, 2, 3])
    axios.post(`${QUERYHOST}/postTest`, formData)
    .then((response) => console.log(response))
  }

  // 入参formData(字符串的[1,2, 3])  服务端可以解析
  fetchFormHeader = () => {
    const params = 'name=123&age=[1,2, 3]'
    fetch(`${QUERYHOST}/postTest`, {
      method: 'post',
      body: params,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
    })
  }

  // 入参formData(字符串的[1,2, 3])  服务端可以解析
  axiosFormHeader = () => {
    const params = 'name=123&age=[1,2, 3]'
    axios({
      url: `${QUERYHOST}/postTest`,
      method: 'post',
      data: params,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    })
    .then((response) => console.log(response))
  }

  render() {
    return (
      <div>
        <button onClick={this.fetchJson}>fetchJson</button>
        <button onClick={this.axiosJson}>axiosJson</button>
        <button onClick={this.fetchForm}>fetchForm</button>
        <button onClick={this.axiosForm}>axiosForm</button>
        <button onClick={this.fetchFormHeader}>fetchFormHeader</button>
        <button onClick={this.axiosFormHeader}>axiosFormHeader</button>
      </div>
      
    );
  }
}