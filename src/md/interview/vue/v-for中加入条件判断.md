## v-for中加入条件判断
### v-for循环中直接使用v-if进行条件判断
- 直接在v-for中使用v-if可能会导致性能问题。
```
<ul>
  <li v-for="item in items" :key="item.id" v-if="item.isActive">
    {{ item.name }}
  </li>
</ul>
```
### 使用template标签
- 为了避免在v-for循环中直接使用v-if（这可能会导致性能问题），可以使用template标签包裹条件判断。
```
<ul>
  <template v-for="item in items" :key="item.id">
    <li v-if="item.isActive">
      {{ item.name }}
    </li>
  </template>
</ul>
```
### 使用计算属性过滤数据
- 如果条件判断较为复杂，可以使用计算属性先过滤数据，再进行循环渲染。
```
computed: {
  activeItems() {
    return this.items.filter(item => item.isActive);
  }
}

<ul>
  <li v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </li>
</ul>
```