# Promise 详解

## 一、基础概念

### 1. 什么是 Promise
- 异步编程的解决方案
- 比回调函数更优雅的处理方式
- 支持链式调用，避免回调地狱

### 2. Promise 状态
- **pending**：初始状态
- **fulfilled**：操作成功完成
- **rejected**：操作失败

## 二、基本用法

### 1. 创建 Promise
```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve(value);
  } else {
    reject(error);
  }
});
```

### 2. 使用 Promise
```javascript
promise
  .then(value => {
    // 处理成功情况
    console.log(value);
  })
  .catch(error => {
    // 处理错误情况
    console.error(error);
  })
  .finally(() => {
    // 无论成功失败都会执行
    console.log('完成');
  });
```

## 三、高级特性

### 1. Promise 链式调用
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => handleError(error));
```

### 2. Promise 静态方法
```javascript
// Promise.all：等待所有 Promise 完成
Promise.all([promise1, promise2])
  .then(values => console.log(values));

// Promise.race：第一个完成的 Promise
Promise.race([promise1, promise2])
  .then(value => console.log(value));

// Promise.resolve：快速创建已解决的 Promise
Promise.resolve('success');

// Promise.reject：快速创建已拒绝的 Promise
Promise.reject(new Error('fail'));
```

## 四、错误处理

### 1. 全局错误捕获
```javascript
// 浏览器环境
window.addEventListener('unhandledrejection', (event) => {
  const { reason, promise } = event;
  console.error('未处理的 Promise 错误:', reason);
  event.preventDefault();
});

// Node.js 环境
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 错误:', reason);
});
```

### 2. 取消 Promise
```javascript
const controller = new AbortController();
const signal = controller.signal;

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (signal.aborted) {
      reject(new Error('Promise 被取消'));
    } else {
      resolve('操作成功');
    }
  }, 1000);
});

// 使用
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error.message));

// 取消 Promise
controller.abort();
```

## 五、最佳实践

### 1. 错误处理建议
- 始终使用 `.catch()` 处理错误
- 避免在 Promise 中抛出异常
- 使用全局错误处理作为最后防线

### 2. 性能优化
- 避免不必要的 Promise 嵌套
- 使用 `Promise.all` 并行处理多个请求
- 合理使用 `Promise.race` 处理超时

### 3. 代码组织
- 将复杂的 Promise 链拆分为小函数
- 使用 async/await 简化代码
- 保持 Promise 链的可读性

## 六、常见问题

### 1. 回调地狱
```javascript
// 不推荐
doSomething(result => {
  doSomethingElse(result, newResult => {
    doThirdThing(newResult, finalResult => {
      console.log(finalResult);
    });
  });
});

// 推荐
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => console.log(finalResult));
```

### 2. 错误传播
```javascript
// 错误会沿着 Promise 链传播
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .catch(error => handleError(error)); // 捕获所有错误
```

## 七、总结

### 1. 核心优势
- 更好的错误处理
- 链式调用更清晰
- 支持并行处理
- 可取消操作

### 2. 使用建议
- 优先使用 Promise 处理异步操作
- 合理组织 Promise 链
- 注意错误处理
- 考虑性能优化