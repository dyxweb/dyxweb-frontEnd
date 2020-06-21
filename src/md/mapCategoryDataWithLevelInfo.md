## 操作类目结构数据添加当前项是该层级的第几项
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
const mapCategoryDataWithLevelInfo = data => {
  if (Array.isArray(data) && data.length > 0) {
    const levelData = {};
    const deep = (data, level = 1) => {
      const newData = []; 
      data.forEach(item => {
        typeof(levelData[level]) === 'undefined' ? levelData[level] = 1 : levelData[level] += 1;
        let obj = {
          ...item,
          sameLevelNum: levelData[level], // 当前项是该层级中的第几个
          currentLevel: level, // 当前项属于的层级
        };
        if (Array.isArray(item.children) && item.children.length > 0) {
          const tempData = deep(item.children, level+1);
          obj.children = tempData;
        }
        newData.push(obj);
      })
      return newData;
    }
    return deep(data);
  } else {
    return [];
  }
}

mapCategoryDataWithLevelInfo(categoryData)
```