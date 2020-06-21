/**
 * 接口请求方法(get, post)
 */
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
  })
  .then((response) => response.json())
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
      'content-type': 'application/json'
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

export default { get, post };