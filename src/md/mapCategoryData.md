## 深层次遍历数据
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
 * changeLabelList:array 所需要将原数据中的属性变成期望属性的对应关系
 * copyPrev:boolean 是否要保留原数据中的所有属性
 */
const mapCategoryData = (data, changeLabelList, copyPrev = true) => {
  if (Array.isArray(data) && data.length > 0) {
    const newData = []; 
    data.forEach(item => {
      let obj = copyPrev ? {...item} : {};
      changeLabelList.forEach(item1 => {
        obj[item1[1]] = item[item1[0]]
      });
      if (Array.isArray(item.children) && item.children.length > 0) {
        const tempData = mapCategoryData(item.children, changeLabelList, copyPrev);
        obj.children = tempData;
      }
      newData.push(obj);
    })
    return newData;
  } else {
    return [];
  }
}

mapCategoryData(
  categoryData,
  [
    ['name', 'label'],
    ['id', 'value'],
  ],
  false
);
```