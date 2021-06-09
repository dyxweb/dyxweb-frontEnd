## [事件流](https://www.toutiao.com/i6620640238509228552/)
> 满足同时触发多个事件时(一次点击会触发多个不同对象上的事件)的执行顺序：一个完整的事件流是从window开始，最后回到window的过程。并且被分为捕获阶段、目标过程、冒泡过程。

### 三种事件模型
1. DOM0级模型：这种模型不会传播，所以没有事件流的概念，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过 js属性来指定监听函数。这种方式是所有浏览器都兼容的。
2. IE 事件模型：在该事件模型中，一次事件共有两个过程，事件处理阶段，和事件冒泡阶段。事件处理阶段会首先执行目标元素绑定的监听事件。然后是事件冒泡阶段，冒泡指的是事件从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。这种模型通过 attachEvent 来添加监听函数，可以添加多个监听函数，会按顺序依次执行。
3. DOM2 级事件模型：在该事件模型中，一次事件共有三个过程，第一个过程是事件捕获阶段。捕获指的是事件从 document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模型，事件绑定的函数是 addEventListener，其中第三个参数可以指定事件是否在捕获阶段执行。

### 事件冒泡和事件捕获
> 假设一个元素div，它有一个下级元素p,这两个元素都绑定了click事件，如果用户点击了p，它在div和p上都触发了click事件，不同的事件类型事件的执行顺序也不同。
  
1. 冒泡型事件：事件按照从最特定的事件目标到最不特定的事件目标(document对象)的顺序触发。
2. 捕获型事件：事件从最不精确的对象(document 对象)开始触发，然后到最精确
### addEventListener
> 使用 addEventListener 进行事件绑定，addEventListener默认使用冒泡流，第三个参数设为true的时候，则使用捕获流。

```
<div id='one'>
  <div id='two'>
    <div id='three'>
      <div id='four'>
        Event
      </div>
    </div>
  </div>
</div>

<script type='text/javascript'>
  var one=document.getElementById('one');
  var two=document.getElementById('two');
  var three=document.getElementById('three');
  var four=document.getElementById('four');

  one.addEventListener('click',function(){
    alert('one');
  }, false);

  two.addEventListener('click',function(){
    alert('two');
  }, false);

  three.addEventListener('click',function(){
    alert('three');
  }, false);

  four.addEventListener('click',function(){
    alert('four');
  }, false);
</script>
// 点击之后，弹框顺序就是 four、three、two、one然后把addEventListener的第三个参数都变成true之后弹框的顺序就改变成 one、two、three、four。
```

### 事件对象
> 在触发DOM上的某个事件时，会产生一个事件对象event，这个对象中包含着所有与事件有关的信息。

- currentTarget、target
> target在事件流的目标阶段,currentTarget在事件流的捕获，目标及冒泡阶段。只有当事件流处在目标阶段的时候，两个的指向才是一样的， 而当处于捕获和冒泡阶段的时候，target指向被单击的对象而currentTarget指向当前事件活动的对象。

- event.type代表事件的类型如 click
- event.preventDefault()阻止特定事件的默认事件
- stopPropagation()用于立即停止事件在DOM层次中的传播，即取消进一步的事件捕获或冒泡
- e.persist() // 异步回调后事件对象的继续使用
- eventPhase
> 这个属性可以用来确定事件当前正位于事件流的哪个阶段。捕获阶段：eventPhase = 1； 处于目标对象上：eventPhase = 2； 冒泡阶段：eventPhase = 3； 要注意的是，尽管“处于目标”发生在冒泡阶段，但是eventPhase仍等于2。下述代码首先执行的事件处理程序是在捕获阶段触发的添加到document.body中的那一个，会弹出一个警告框显示1 其次会触发在按钮上注册的事件处理程序(因为第三个参数设置为true，表示使用捕获流)，此时eventPhase为2 最后在冒泡阶段触发添加到document.body中的那一个，显示eventPhase为3。 当eventPhase等于2时，this、target、currentTarget始终都是相等的。只有在事件处理程序执行期间，event对象才会存在；一旦事件处理程序执行完成，event对象就会被销毁。

```
btn.onclick = function(event){
 alert(event.eventPhase); // 2
}
document.body.addEventListener("click",function(event){
 alert(event.eventPhase); // 1
}, true);
document.body.onclick = function(event){
 alert(event.eventPhase); // 3
}
```

### 同一个元素既有click事件又有addEventListener事件，点击之后两个事件都会触发，且先执行add的后执行click的
### 阻止事件传播
1. 阻止冒泡：stopPropagation()   IE下  cancelBubble = true
2. 默认事件阻止：preventDefault()  IE下  window.event.returnValue = false;