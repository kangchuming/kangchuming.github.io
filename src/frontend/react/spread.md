

## ✅ 扩展运算符（Spread / Rest Operator）

---

### **1. 扩展（Spread）**

#### 🧩 展开数组

```js
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5];
console.log(newArr);
// [1, 2, 3, 4, 5]
```

---

#### 🧩 浅拷贝数组

```js
const arr = [1, 2, 3];
const copy = [...arr];
console.log(copy);
// [1, 2, 3]
console.log(arr === copy);
// false （不同引用）
```

---

#### 🧩 合并数组

```js
const a1 = [1, 2, 3];
const a2 = [4, 5, 6];
const arr = [...a1, ...a2];
console.log(arr);
// [1, 2, 3, 4, 5, 6]
```

---

#### 🧩 展开对象

```js
const obj = { a: 1, b: 2 };
const newObj = { ...obj, c: 3, d: 4 };
console.log(newObj);
// { a: 1, b: 2, c: 3, d: 4 }
```

---

### **2. 剩余参数（Rest）**

#### 🧩 函数参数收集

```js
const sum = (...nums) => {
  return nums.reduce((a, b) => a + b, 0);
};
console.log(sum(1, 2, 3));
// 6
```

> ⚠️ 你原来的代码里：
>
> ```js
> const res = (...arr) => { arr.reduce(...) }
> console.log(res)
> ```
>
> 这里函数没有 `return`，也没传参数；所以结果是 `undefined`。
> 上面这版修正了。

---

#### 🧩 数组解构收集

```js
const arr = [1, 2, 3, 4];
const [first, ...rest] = arr;
console.log(first);
// 1
console.log(rest);
// [2, 3, 4]
```

---

#### 🧩 对象解构收集

```js
const obj = { a: 1, b: 2, c: 3 };
const { a, ...rest } = obj;
console.log(a);
// 1
console.log(rest);
// { b: 2, c: 3 }
```

> ⚠️ 你原来这部分写成了：
>
> ```js
> console.log(a) // {a:1}
> ```
>
> 实际上 `a` 是数字 `1`，不是对象。

---

## 📘 小结

| 类型            | 位置     | 含义      | 示例                                          |
| ------------- | ------ | ------- | ------------------------------------------- |
| 展开运算符（Spread） | 表达式中   | 展开数组/对象 | `[...arr]`, `{...obj}`                      |
| 剩余参数（Rest）    | 参数或解构中 | 收集剩余值   | `(...args)`, `[a, ...rest]`, `{a, ...rest}` |

---