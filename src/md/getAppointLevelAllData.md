## 获取指定层级的所有内容
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
 * appointLevel:number 所要获取到数据的截止层级
 */
const getAppointLevelAllData = (data, appointLevel) => {
  const newData = [];
  const deep = (data, level) => {
    data.forEach(item => {
      if(level === appointLevel) {
        newData.push(item);
      }
      if (Array.isArray(item.children) && item.children.length > 0 && level < appointLevel) {
        deep(item.children, level + 1);
      }
    });
  }
  deep(data, 1);
  return newData;
}

getAppointLevelAllData(categoryData, 2)
```