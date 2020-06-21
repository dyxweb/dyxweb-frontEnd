## 统计类目结构数据相同层级的数量
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
getLevelCount = data => {
  if (Array.isArray(data) && data.length > 0) {
    const levelData = {};
    const deep = (data, level) => {
      return data.forEach(item => {
        typeof(levelData[level]) === 'undefined' ? levelData[level] = 1 : levelData[level] += 1;
        if(item.children && item.children.length > 0) {
          deep(item.children, level + 1)
        }
      })
    }
    deep(data, 1);
    return levelData;
  } else {
    return {};
  }
}

getLevelCount(categoryData)
```