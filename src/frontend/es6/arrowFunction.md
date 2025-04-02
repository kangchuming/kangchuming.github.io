# ES6 箭头函数

## 简介

ES6 中的箭头函数（Arrow Functions）是 JavaScript 函数定义的一种简洁语法，与传统普通函数相比，在语法和行为上有显著差异。

## 基本语法

箭头函数使用 `=>` 符号定义，语法更简洁：

```javascript
// 无参数
const func1 = () => { /* ... */ };

// 单个参数（可省略括号）
const func2 = x => x * 2;

// 多个参数
const func3 = (a, b) => a + b;

// 多行函数体（需大括号和 return）
const func4 = (x, y) => {
  const sum = x + y;
  return sum;
};
```

## 箭头函数与普通函数的区别

### 1. this 的绑定

**箭头函数**：
- 没有自己的 this，其 this 继承自外层作用域（词法作用域）
- this 在定义时确定，运行时不会改变

```javascript
const obj = {
  value: 10,
  normalFunc: function() { console.log(this.value); }, // 输出 10（this 指向 obj）
  arrowFunc: () => console.log(this.value) // 输出 undefined（this 指向外层，如全局）
};
```

**普通函数**：
- this 是动态绑定的，取决于调用方式（如直接调用、对象方法、构造函数等）
- 可能导致意外行为（如回调中 this 丢失）

### 2. 构造函数与 new

**箭头函数**：
- 不能作为构造函数，使用 new 调用会抛出错误（无 [[Construct]] 内部方法）

```javascript
const Arrow = () => {};
new Arrow(); // TypeError: Arrow is not a constructor
```

**普通函数**：
- 可以作为构造函数，通过 new 创建实例

### 3. arguments 对象

**箭头函数**：
- 没有自己的 arguments 对象，需通过剩余参数（...args）获取参数

```javascript
const arrowFunc = (...args) => console.log(args);
```

**普通函数**：
- 可通过 arguments 对象访问所有参数

### 4. prototype 属性

**箭头函数**：
- 没有 prototype 属性（无法用于构造函数）

```javascript
console.log(arrowFunc.prototype); // undefined
```

**普通函数**：
- 具有 prototype 属性，用于实现继承

### 5. 语法简洁性

箭头函数省略了 function 关键字，适合简短逻辑（如数组方法回调）：

```javascript
const nums = [1, 2, 3];
const doubled = nums.map(x => x * 2);
```

### 6. 其他区别

**super 和 new.target**：
- 箭头函数没有自己的 super 和 new.target，继承自外层

**生成器函数**：
- 箭头函数不能用作生成器（不能使用 yield）

**call/apply/bind**：
- 箭头函数的 this 无法通过 call 或 apply 修改

## 适用场景

**推荐使用箭头函数的场景**：
- 需要固定 this 的回调函数（如事件监听器、setTimeout）
- 简短函数式代码

**推荐使用普通函数的场景**：
- 对象方法
- 构造函数
- 需要动态 this 或 arguments 的场景

## 总结

箭头函数通过简化语法和固化 this 解决了传统函数的常见痛点，但并非全能替代。理解其特性（如词法 this、无构造函数能力）是避免误用的关键。