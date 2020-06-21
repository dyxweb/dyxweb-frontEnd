## 根据所有最后一级id值得到想要的类目结构数据
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
 * values:array 所选中的最后一级的values(必须是最后一级)
 * uniqueKey:string 数组中每一项对象中唯一的标识所对应的属性
 * type: select or filter select根据values生成选择的类目数据， filter根据values生成过滤后的类目数据
 */
const filterCategoryData = (data, values, uniqueKey, type = 'select') => {
  if (Array.isArray(values) && values.length > 0) {
    const newValues = Array.isArray(values) ? values : [values];
    const newData = [];
    data.forEach(item => {
      let obj = {};
      if (Array.isArray(item.children) && item.children.length > 0) {
        const tempData = filterCategoryData(item.children, newValues, uniqueKey, type);
        obj = {
          ...item,
          children: tempData,
        };
        // 当children不为空时才保留该数据
        if (obj.children.length > 0) {
          newData.push(obj);
        }
      } else if (
        type === 'select' ? newValues.includes(item[uniqueKey]) : !newValues.includes(item[uniqueKey])
      ) {
        obj = {
          ...item,
        };
        newData.push(obj);
      }
    });
    return newData;
  } else {
    return data;
  }
};

filterCategoryData(categoryData, ['1-1-1', '3-1-2-1', '3-2'], 'value', 'select');
```