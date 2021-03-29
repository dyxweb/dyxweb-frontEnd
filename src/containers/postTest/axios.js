/**
 * post请求json形式
 */
 import React, { Component } from 'react';
 import axios from 'axios'
 import qs from 'qs'
 
 export default class PostAxiosJson extends Component {
   axiosJson = () => {
     const params = { name: 'dyx', age: [1, 2, 3]}
     axios.post(`${QUERYHOST}/postTest`, params)
     .then((response) => console.log(response))
   }
 
   // 入参自动转为formData 服务端接收到为数组数据格式
   axiosJsonString = () => {
    const params = qs.stringify({ name: 'dyx', age: [1, 2, 3]})
     axios.post(`${QUERYHOST}/postTest`, params)
     .then((response) => console.log(response))
   }

   // 入参自动转为formData 服务端接收到为数组数据格式
   axiosJsonformatArray = () => {
    const params = qs.stringify({ name: 'dyx', age: [1, 2, 3]}, { arrayFormat: 'repeat' })
     axios.post(`${QUERYHOST}/postTest`, params)
     .then((response) => console.log(response))
   }
 
   render() {
     return (
       <div>
         <button onClick={this.axiosJson}>axiosJson</button>
         <button onClick={this.axiosJsonString}>axiosJsonString</button>
         <button onClick={this.axiosJsonformatArray}>axiosJsonformatArray</button>
       </div>
       
     );
   }
 }