## 指定一个id找到对应节点的祖先节点id
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
 * value: 简单数据类型 所要查找属性的值
 * uniqueKey:string 所要查找的属性
 */
const findParentId = (data, value, uniqueKey) => {
  const path = []; // 从祖先到指定节点的数组
  let findFlag = false;
  const deep = (array, value) => {
    array.forEach(item => {
      if (findFlag) return;
      path.push(item.value); // 每一次循环都将value push到数组中
      if (item[uniqueKey] === value) {
        findFlag = true;
      } else if (Array.isArray(item.children) && item.children.length) {
        deep(item.children, value);
      } else {
        path.pop(); // 如果是最后一层且不相同则将刚push进去的值去除
      }
    });
    if (!findFlag) {
      path.pop(); // 当有children时调用deep函数结束时且还是没有找到相同的id则将有children的item的value从path中去除
    }
  }
  deep(data, value);
  return path;
}

findParentId(categoryData, '3-1-1-1', 'value');
```