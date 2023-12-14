## grid网格布局
### grid布局和flex布局
- grid布局与flex布局的共同点是元素均存放在一个父级容器内，尺寸与位置受容器影响。
- 声明grid布局之后，容器内部元素为块元素。声明flex布局之后，容器内部元素为行内元素。
- flex布局使用单坐标轴的布局系统，grid布局中使用二维布局，使元素可以在二个维度上进行排列。
- flex布局是以内容为基础，grid布局是以布局为基础。
### 网格布局术语
- 网格容器
> 通过添加display: grid将一个元素设置成一个网格容器。

- 网格项目
> 网格容器中的每一个子元素都是网格项目。

- 网格线
> 网格线就是将网格划分开的线条。

- 网格单元格
> 网格单元格就是网格容器中划分出来最小的单元。

- 网格轨道
> 网格轨道就是由若干个网格单元格组成的横向或者纵向区域。

- 网格区域
> 网格区域也是由若干个网格单元格组成的区域，但是不同于网格轨道，网格区域的规格不局限与单个维度，可以包含横向和纵向区域。

### fr单位
> 表示网格容器中可用空间的一份。

```
grid-template-columns: 1fr 1fr 1fr;    // 表示三列且空间三等分
grid-template-columns: 2fr 1fr 1fr;    // 表示三列且空间四等分，两份给第一列，剩下两列各占一份。
grid-template-columns: 400px 2fr 1fr;  // 表示三列，第一列400px，减去400px后剩下空间三等分，两份给第二列，剩下一份给第三列。
```
### repeat(time, content)
> 标记重复部分，第一个参数time表示重复的次数，第二个参数content表示重复的内容。

```
repeat(3, 1fr) = 1fr 1fr 1fr

20px repeat(3, 1fr) 20px = 20px 1fr 1fr 1fr 20px

repeat(3, 1fr 2fr) = 1fr 2fr 1fr 2fr 1fr 2fr
```
### minmax(min, max)
> 定义网格一个尺寸的范围，第一个参数min表示网格尺寸的最小值，第二个参数表示网格尺寸的最大值。

```
minmax(100px, 200px)  // 表示网格最小是100px，最大是200px

minmax(100px, auto)   // 表示网格最小是100px，最大为auto，auto意思是将根据内容的大小自动变换
```
### grid-template-columns
> 定义网格容器具体的列。

```
// 五列，第三列自动占用容器剩余的可用空间
grid-template-columns: 40px 50px auto 50px 40px;
```
### grid-template-rows
> 定义网格容器具体的行。

```
// 三行，第三行自动占用容器剩余的可用空间
grid-template-rows: 25% 100px auto;
```
### grid-gap 
> grid-column-gap和grid-row-gap分别定义网格之间的列间距和行间距，grid-gap是简写形式，第一个值为行间距，第二个值为列间距。

```
grid-column-gap: 10px;
grid-row-gap: 15px;

grid-gap: 15px 10px; // 简写形式
```
### grid-area
- 语法
  1. grid-row-start 项目的起始行。
  2. grid-column-start 项目的起始列。
  3. grid-row-end 项目的结束行。
  4. grid-column-end 项目的结束列。
```
grid-area: grid-row-start / grid-column-start / grid-row-end / grid-column-end
```
- 以行列的形式表达
```
grid-area: 行开始 / 列开始 / 行结束 / 列结束  
```
- 以跨行列数的形式表达
```
grid-area: 行开始 / 列开始 / span 2(跨行数) / span 2(跨列数)
```
- 项目占据第一行和第二行，第一列和第二列。
```
grid-area: 1/1/3/3;
```
### 隐式网格轨道
- 当声明的网格容器内的单元格数量已经不够存放网格项目时，多出的网格项目会自动放入到自动生成的网格单元中，这时原来声明的网格单元叫显示轨道，多出的网格项目显示的轨道叫隐式轨道。
- 多出的项目在容器中默认按照先行后列的顺序排列即“行优先”。
```
grid-auto-flow: row;
```
- 自动生成的隐式轨道的高度是自动的，“行优先”时要设置隐式轨道的行高。
```
grid-auto-rows: 200px;
```
- 多出的项目在容器中按照“列优先”排列。 
```
grid-auto-flow: column;
```
- 自动生成的隐式轨道的宽度是自动的，“列优先”时要设置隐式轨道的列宽。
```
grid-auto-columns: 200px;
```
### 设置grid自动换行
```
grid-template-columns: repeat(auto-fit, 100px);
```
### 控制网格项的对齐方式，用法和效果与flex布局类似
- justify-items
- align-items
- justify-content
- align-content
- justify-self
- align-self