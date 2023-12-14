## if语句
### 条件测试
- 检查是否相等 ==
    - 使用相等运算符在两边的值相等时返回True，不相等时返回False。
    - 检查是否相等时区分大小写。
-  检查是否不相等 !=
    - 使用不相等运算符在两边的值不相等时返回True，相等时返回False。
    - 检查是否不相等时区分大小写。
- 数值比较
    - 可以进行各种数学比较，是否相等、是否小于、是否小于等于、是否大于、是否大于等于。
- 使用and检查多个条件
    - 当每个检查条件都通过了，整个表达式为True；
- 使用or检查多个条件
    - 当至少一个检查条件通过了，整个表达式为True；
- 使用in检查特定值是否包含在列表
```
1 in [1, 2, 3] // true
```
- 使用not in检查特定值是否不包含在列表中
```
4 not in [1, 2, 3] // true
```
### if语句
- 当条件测试通过后执行缩进代码块的代码。
```
if conditional_test:
    do something
```
### if-else语句
- 当条件测试通过后执行缩进代码块的代码，未通过时执行else后缩进代码块的代码。
```
if conditional_test:
    do something
else:
    do something
```
### if-elif-else语句
- 当有多个判断条件时使用if-elif-else语句。
- 可以有多个elif判断语句。
```
if conditional_test:
    do something
elif conditional_test:
    do something
else:
    do something
```