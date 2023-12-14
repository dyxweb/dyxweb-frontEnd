/**
 * 接口请求方法(get, post)
 */
import { getCookie } from 'utils/cookie';

// get请求方法
const get = (url, params) => {
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  return fetch(url, {
    method: 'get',
    headers: {
      'Authorization': getCookie('token')
    },
  })
  .then((response) =>  response.json())
  .then((json) => {
    return json;
  })
  .catch((error) => {
    // alert(error)
  })
};

// post请求方法
const post = (url, params) => {
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      'Authorization': getCookie('token')
    },
  })
  .then((response) => response.json())
  .then((json) => {
    return json;
  })
  .catch((error) => {
    // alert(error)
  })
};

// upload请求方法
const upload = params => {
  return fetch(`${QUERYHOST}/upload`, {
    method: 'post',
    body: params,
    headers: {
    },
  })
  .then((response) => response.json())
  .then((json) => {
    return json;
  })
  .catch((error) => {
    // alert(error)
  })
};

// const upload = params => {
//   return new Promise(resolve => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', `${QUERYHOST}/upload`);
//     xhr.send(params);
//     xhr.onload = e => {
//       resolve({
//         data: e.target.response
//       });
//     };
//   });
// }


export default { get, post, upload };