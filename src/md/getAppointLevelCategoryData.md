## 获取截止到指定层级的数据
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
getAppointLevelCategoryData = (data, appointLevel, currentLevel = 1) => {
  const newData = []; 
  data.forEach(item => {
    let obj = {};
    if (Array.isArray(item.children) && item.children.length > 0) {
      if (currentLevel < appointLevel) {
        const tempData = getAppointLevelCategoryData(item.children, appointLevel, currentLevel + 1);
        obj = {
          ...item,
          children: tempData,
        }
      } else {
        obj = {
          ...item,
          children: []
        }
      }
    } else {
      obj = {
        ...item,
      }
    }
    newData.push(obj);
  })
  return newData;
}

getAppointLevelCategoryData(categoryData, 2);
```