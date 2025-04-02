# JavaScript 生成器 (Generator)

## 概述

Generator（生成器）是 JavaScript 中一种特殊的函数（ES6 引入），用于控制函数的执行流程，允许函数暂停和恢复，同时生成一系列值。它是实现惰性求值和异步编程的重要工具（虽然现在更推荐用 async/await）。

## 核心概念

### 定义生成器函数

使用 `function*` 语法定义生成器函数，内部通过 `yield` 关键字暂停执行并返回一个值：

```javascript
function* myGenerator() {
  yield 1;
  yield 2;
  return 3;
}
```

### 生成器对象

调用生成器函数不会立即执行，而是返回一个生成器对象（实现了 Iterator 接口）：

```javascript
const gen = myGenerator(); // 生成器对象
```

### 控制执行流程

通过 `next()` 方法逐步执行，返回 `{ value, done }` 对象：

```javascript
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: true }
```

## 核心用法

### 1. 暂停与恢复执行

- `yield` 会暂停函数执行，并返回右侧的值
- 下次调用 `next()` 时，从暂停处恢复执行，直到遇到下一个 `yield` 或 `return`

### 2. 传递值到生成器

`next()` 可以传入参数，作为上一个 `yield` 表达式的结果：

```javascript
function* gen() {
  const a = yield "First yield";
  const b = yield a + 10;
  return b;
}

const g = gen();
console.log(g.next());    // { value: 'First yield', done: false }
console.log(g.next(5));   // a = 5 → { value: 15, done: false }
console.log(g.next(100)); // b = 100 → { value: 100, done: true }
```

### 3. 错误处理

使用 `throw()` 方法向生成器内部抛出错误：

```javascript
function* errorGen() {
  try {
    yield 1;
  } catch (e) {
    console.log("Caught:", e);
  }
}

const g = errorGen();
g.next();       // { value: 1, done: false }
g.throw("Oops"); // 生成器内部捕获错误 → "Caught: Oops"
```

### 4. 提前终止

使用 `return()` 方法提前终止生成器：

```javascript
const g = myGenerator();
g.next();        // { value: 1, done: false }
g.return("End"); // { value: "End", done: true }
```

## 难点与注意事项

### 1. 执行流程控制

- **理解暂停与恢复的时机**：生成器的执行流程由 `next()` 驱动，每次执行到 `yield` 或 `return` 时暂停
- **值的传递方向**：
  - `yield` 右侧的值传递给外部（通过 `next().value`）
  - `next(arg)` 的参数传递给内部，作为上一个 `yield` 的返回值

### 2. 异步编程的复杂性

虽然生成器可用于异步编程（结合 Promise），但需要手动管理流程，代码可读性较差：

```javascript
function* asyncGenerator() {
  const data = yield fetchData(); // 假设 fetchData 返回 Promise
  yield process(data);
}

// 手动执行
const g = asyncGenerator();
g.next().value
  .then(data => g.next(data))
  .then(result => g.next(result));
```

### 3. 迭代器协议

生成器实现了 Iterator 接口，可直接用于 `for...of` 循环，但需注意：
- `for...of` 会忽略 `return` 返回的值（只遍历 `yield` 的值）：

```javascript
function* gen() {
  yield 1;
  yield 2;
  return 3;
}

for (const val of gen()) {
  console.log(val); // 输出 1, 2（不会输出 3）
}
```

### 4. 资源管理

生成器可能持有外部资源（如文件句柄或网络连接），需确保在不再使用时调用 `return()` 或 `throw()` 释放资源。

## 应用场景

### 惰性求值

生成按需计算的值，节省内存：

```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
```

### 状态机

用生成器实现状态流转：

```javascript
function* stateMachine() {
  let state = "start";
  while (true) {
    switch (state) {
      case "start":
        state = yield "State: Start";
        break;
      case "running":
        state = yield "State: Running";
        break;
      case "end":
        return "State: End";
    }
  }
}
```

### 协程（Coroutine）

通过生成器实现多任务协作调度（需配合调度器）。

## 总结

### Generator 的核心价值：

- 提供对函数执行流程的精细控制
- 支持惰性迭代和异步编程（尽管 async/await 更简洁）

### 主要难点：

- 理解 `yield` 和 `next()` 的交互逻辑
- 手动管理异步流程的复杂性
- 正确处理错误和资源释放

生成器在特定场景下非常强大，但在现代 JavaScript 中，许多异步问题已由 async/await 解决。理解生成器有助于深入掌握 JavaScript 的底层执行机制。