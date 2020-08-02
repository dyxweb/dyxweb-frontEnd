## 判断某一个id是否为最后一层的id
```
const categoryData = [
  {"label":'1',"value":"1","children":[
    {"label":"1-1","value":"1-1","parentId":"1","children":[
      {"label":"1-1-1","value":"1-1-1","parentId":"1-1","children":[]}
    ]}
  ]},
  {"label":'3',"value":"3","children":[
    {"label":"3-1","value":"3-1","parentId":"3","children":[
      {"label":"3-1-1","value":"3-1-1","parentId":"3-1","children":[
        {"label":"3-1-1-1","value":"3-1-1-1","parentId":"3-1-1","children":[]}
      ]},
      {"label":"3-1-2","value":"3-1-2","parentId":"3-1","children":[
        {"label":"3-1-2-1","value":"3-1-2-1","parentId":"3-1-2","children":[]}
      ]}
    ]},
    {"label":"3-2","value":"3-2","parentId":"3","children":[]}
  ]},
  {"label":'2',"value":"2","children":[
    {"label":"2-1","value":"2-1","parentId":"2","children":[]}
  ]}
];

/*
 * data:array 类目结构的数据，数组内部元素为对象
 * value: 简单数据类型 所要判断属性的值
 * uniqueKey:string 所要判断的属性
 */
const isLastLevelKey = (data, value, uniqueKey) => {
  if (Array.isArray(data) && data.length > 0 && value && uniqueKey) {
    let flag = false;
    const deep = innerData => {
      return innerData.some(item => {
        if (item[uniqueKey] === value) {
          if (!item.children || item.children.length === 0) {
            flag = true;
            return true;
          } else {
            return true;
          }
        } else if (item.children && item.children.length > 0) {
          return deep(item.children);
        }
      });
    };
    deep(data);
    return flag;
  } else {
    return false;
  }
};

console.log(isLastLevelKey(categoryData, '3-1-1-1', 'value'));



const isLastLevelId = (categoryData, id) => {
  let flag = false; // 返回的标识
  const deep = data => {
    for(let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        if(Array.isArray(data[i].children) && data[i].children.length > 0) {
          break;
        } else {
          flag = true;
          break;
        }
      } else if (Array.isArray(data[i].children) && data[i].children.length > 0) {
        deep(data[i].children);
      }
    }
  };
  deep(categoryData);
  return flag;
};

// 优化后的方法，找到之后就不再循环(findFlag标识)
const isLastLevelId = (categoryData, id) => {
  let flag = false; // 返回的标识
  let findFlag = false; // 是否找到的标识
  const deep = data => {
    for(let i = 0; i < data.length; i++) {
      if (findFlag) {
        break;
      }
      if (data[i].id === id) {
        findFlag = true;
        if(Array.isArray(data[i].children) && data[i].children.length > 0) {
          break;
        } else {
          flag = true;
          break;
        }
      } else if (Array.isArray(data[i].children) && data[i].children.length > 0) {
        deep(data[i].children);
      }
    }
  };
  deep(categoryData);
  return flag;
};
```
