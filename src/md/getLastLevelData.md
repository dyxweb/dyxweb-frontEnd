## 获取所有最后一级的数据
```
const categoryData = [
  {"id":"1","name":"第一个第一层","children":[
    {"id":"2","name":"第一个第二层1","children":[
      {"id":"3","name":"第一个第三层1"},
      {"id":"4","name":"第一个第三层2"}
    ]},
  ]},
  {"id":"5","name":"第二个第一层","children":[
    {"id":"6","name":"第二个第二层1","children":[]},
    {"id":"7","name":"第二个第二层2","children":[]}
  ]},

  {"id":"8","name":"第三个第一层","children":[]},
]
/*
 * data:array 类目结构的数据，数组内部元素为对象
 */
const getLastLevelData = data => {
  if (Array.isArray(data) && data.length > 0) {
    const newData = [];
    const deep = data => {
      data.forEach(item => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          deep(item.children);
        } else {
          newData.push(item);
        }
      });
    }
    deep(data);
    return newData;
  } else {
    return [];
  }
}

getLastLevelData(categoryData);
```