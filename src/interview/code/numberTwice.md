## 给定一个数组，返回出现两次的值。要求只执行一次循环，且时间复杂度为O(n)

- 代码
```
const search = (nums) => {
    const count = {};

    for(let item of nums) {
        if(count[item]) {
            return item;
        } else {
            count[item] = 1;
        }
    }
} 
```

### 解释
* obj可以使用obj.xxx = xx 或者obj[xxx] = xxx来进行赋值，通常obj可以用来做计数器，如下所示 *

```
let nums = [1, 2, 2, 3, 3, 3];
let count = {};

for (let num of nums) {
    if (count[num]) {
        count[num]++; // 如果数字已存在，计数加 1
    } else {
        count[num] = 1; // 如果数字不存在，初始化为 1
    }
}

console.log(count); 
```

### 附带学习对象
1. 创建对象：对象可以通过字面量方式创建，用 {} 包裹键值对：
```
let obj = {
    key1: "value1",
    key2: "value2"
};
```
2. 访问对象的属性:可以通过点号（.）或方括号（[]）访问对象的属性：
```
console.log(obj.key1); // 输出: value1
console.log(obj["key2"]); // 输出: value2
```
3. 添加或修改属性：可以通过赋值的方式添加或修改对象的属性
```
obj.key3 = "value3"; // 添加新属性
obj["key1"] = "new value1"; // 修改已有属性
```
4. 删除属性:使用 delete 关键字可以删除对象的属性：
```
delete obj.key2; // 删除 key2 属性
```
5. 检查属性是否存在:使用 in 运算符或 hasOwnProperty 方法可以检查对象是否包含某个属性：
```
console.log("key1" in obj); // 输出: true
console.log(obj.hasOwnProperty("key3")); // 输出: true
```
6. 遍历对象:可以使用 for...in 循环遍历对象的所有属性：
```
for (let key in obj) {
    console.log(key, obj[key]); // 输出: key1 value1, key3 value3
}
```
7.  对象作为计数器: 对象常用于统计元素出现的次数，比如统计数组中每个数字的出现次数：
```
let nums = [1, 2, 2, 3, 3, 3];
let count = {};

for (let num of nums) {
    if (count[num]) {
        count[num]++; // 如果数字已存在，计数加 1
    } else {
        count[num] = 1; // 如果数字不存在，初始化为 1
    }
}

console.log(count); // 输出: {1: 1, 2: 2, 3: 3}
```
8. 对象与 Map 的区别:对象：键只能是字符串或 Symbol，属性顺序不保证，性能较高。
Map：键可以是任意类型（包括对象），属性顺序与插入顺序一致，功能更强大。
9. 对象的方法:对象有一些内置方法，比如：
Object.keys(obj)：返回对象的所有键组成的数组。
Object.values(obj)：返回对象的所有值组成的数组。
Object.entries(obj)：返回对象的键值对组成的数组。
```
let obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // 输出: ["a", "b", "c"]
console.log(Object.values(obj)); // 输出: [1, 2, 3]
console.log(Object.entries(obj)); // 输出: [["a", 1], ["b", 2], ["c", 3]]
```
10.  对象的使用场景
存储结构化数据（如用户信息、配置项等）。
作为字典或映射使用（如统计元素出现次数）。
作为函数的参数或返回值。