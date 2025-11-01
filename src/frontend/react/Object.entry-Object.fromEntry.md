## entries、fromEntries和map

1. entries 是将object转换为数组的函数
```js
const obj = {a: 1, b: 2};
let arr = Object.entries(obj);
console.log(arr);
[[a,1],[b,2]];
```

2. fromEntries 是将转为数组的obj再次变回obj
```js
const obj = {a: 1, b: 2};
let arr = Object.entries(obj);
console.log(arr);
[[a,1],[b,2]];
const newObj = Object.fromEntries(arr);
console.log(newObj)
{a:1, b:2};

3. map, map数组遍历时，第一个参数为item(即遍历器),第二个参数为index
```js error
const obj = {a: 1, b: 2};
let arr = Object.entries(obj).map((item, key) => [item,key]);
console.log(arr)
[
  [ ['a',1], 0 ],
  [ ['b',2], 1 ],
  [ ['c',3], 2 ]
]
```

```js 
const obj = {a: 1, b: 2};
let arr = Object.entries(obj).map(([item, key]) => [item,key]);
console.log(arr)
[[a,1],[b,2]]
```