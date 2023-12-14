## [css加载](https://mp.weixin.qq.com/s/p2VazJE7MyH645T8NjMrrg)
### CSS加载不会阻塞构造文档对象模型(DOM解析)，但是CSS加载会阻塞生成渲染树(DOM渲染)。 
- 构造文档对象模型和构造CSS对象模型是并行的，这解释了CSS加载不会阻塞构造文档对象模型。
- 由于RenderTree是依赖于DomTree和CssomTree的，所以RenderTree必须等待CssomTree构建完成，也就是CSS资源加载完成(或者CSS资源加载失败)后，才能开始生成渲染树。因此CSS加载会阻塞生成渲染树。
- 这可能也是浏览器的一种优化机制，因为加载css的时候，可能会修改DOM节点的样式，如果css加载不阻塞render树渲染的话，那么当css加载完之后render树可能又得重新重绘或者回流了，这就造成了一些没有必要的损耗。等待html和css都加载完之后，根据最终的样式来渲染render树，这种做法性能方面会比较好一点。
```
// network设置网络速度

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>css阻塞</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      h1 {
        color: red !important;
      }
    </style>
    <script>
      function h() {
        console.log(document.querySelectorAll("h1"));
      }
      setTimeout(h, 0);
    </script>
    <link
      href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <h1>这是红色的</h1>
  </body>
</html>
```
- CSS加载时JS能获取到DOM节点，说明CSS加载不会堵塞DOM的解析。
- 使用Performance可以看到在css加载完成后，DOM渲染才完成，说明CSS加载会堵塞DOM渲染(CSS加载完成前，页面白屏)。
### CSS加载会堵塞后面JS的执行
- 由于js可能会操作之前的DOM节点和CSS样式，为了防止渲染出现不可预期的结果，因此浏览器会维持html中CSS和JS的顺序，CSS会在后面的JS执行前先加载执行完毕。
- 浏览器设置GUI渲染线程与JavaScript引擎为互斥的关系，因此css加载会堵塞后面js的执行。
```
// network设置网络速度

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>css阻塞</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      console.log("before css");
      var startDate = new Date();
    </script>
    <link
      href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <h1>这是红色的</h1>
    <script>
      var endDate = new Date();
      console.log("after css");
      console.log("经过了" + (endDate - startDate) + "ms");
    </script>
  </body>
</html>
```
- before css
- after css
- 经过了24174ms

