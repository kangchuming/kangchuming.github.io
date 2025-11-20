# 列表组件设计

## 设计思路
1. 接收数据和类型
2. 循环数据
3. 将参数嵌入进列表项
4. 导出组件

## 代码实现
```js
// 列表组件
const data = [
    '火锅',
    '小面',
    '烤肉',
    '烧烤',
    '奶茶'
]

const LISTTYPE = {
    ORDER: 'orderly',
    DISORDER: 'disorder'
}

function List(props) {
    const { data, type, renderItem } = props;
    const ListTag = type === LISTTYPE.ORDER ? 'ol' : 'ul';

    return (
        <ListTag>
            {data.map((item, i) => (
                <li key={i}>{renderItem ? renderItem(item, i) : item}</li>
            )
            )}
        </ListTag>
    )
}

export default List;
```

## 问题总结
1. 类型用常量
```js
const LISTTYPE = {
    ORDER: 'orderly',
    DISORDER: 'disorder'
}
```

2. 组件的参数，2个及以下用具体的参数，2个及以上的用props
```js
function List(props) {
    const { data, type, renderItem } = props;
}
```

3. 用函数式的写法，而不是命令式写法
```js
// 错误写法
function List(data, type) { 
    const ORDER = ( 
        <ol> {data.map((item) => <li key={item}>{item}</li> )} </ol>
         ) 
    const DISORDER = ( 
        <ul> {data.map(item => <li key={item}>{item}</li> )} </ul> 
        ) 
    return ( type === LISTTYPE[0] ? ORDER : DISORDER ) }
```

```js
// 优化写法
function List({ data, type }) {
    const ListTag = type === LISTTYPE[0] ? 'ol' : 'ul';
    
    return (
        <ListTag>
            {data.map(item => (
                <li key={item}>{item}</li>
            ))}
        </ListTag>
    );
}
```

- 优点：

结构更清晰： 逻辑直接反映结构。

少定义两个变量（ORDER、DISORDER），可维护性更高。

更易扩展： 如果将来还有第三种列表类型（如自定义图标列表），修改点更集中

4. map时,{} 对应return, () 不用return
   
```js
{data.map((item, i) => (
    <li key={i}>
        {renderItem ? renderItem(item, i) : item}
    </li>
))}

```