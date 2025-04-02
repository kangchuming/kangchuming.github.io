# 手写 Promise 实现

## 实现思路

Promise 是 JavaScript 中处理异步操作的重要工具。这个实现包含了 Promise 的核心功能：
- Promise 状态管理（pending、fulfilled、rejected）
- 异步操作支持
- 链式调用
- 错误处理

## 代码实现

```javascript
class MyPromise {
  constructor(executor) {
    // 初始化 Promise 状态和值
    this.status = 'pending';     // Promise 当前状态
    this.value = undefined;      // 成功时的值
    this.reason = undefined;     // 失败时的原因
    // 存储成功和失败的回调函数数组（用于处理异步情况）
    this.onFullfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // resolve 函数：将状态改为 fulfilled，并执行成功回调
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.value = value;
        this.status = 'fulfilled';
        // 执行所有成功回调
        this.onFullfilledCallbacks.forEach(fn => fn());
      }
    }

    // reject 函数：将状态改为 rejected，并执行失败回调
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        // 执行所有失败回调
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    // 执行传入的函数，并捕获可能出现的错误
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  // then 方法：注册成功和失败的回调
  then(onFulfilled, onRejected) {
    // 参数校验：如果不是函数，则使用默认函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw (err) }

    // 创建新的 Promise 以支持链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      // 处理成功状态的函数
      const handleFullfilled = () => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (err) {
            reject(err);
          }
        })
      }

      // 处理失败状态的函数
      const handleRejected = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch(err) {
            reject(err);
          }
        })
      }

      // 根据当前状态决定如何处理回调
      if(this.status === 'fulfilled') {
        // 如果是成功状态，执行成功回调
        handleFullfilled();
      } else if(this.status === 'rejected') {
        // 如果是失败状态，执行失败回调
        handleRejected();
      } else {
        // 如果是等待状态，将回调存入数组
        this.onFullfilledCallbacks.push(handleFullfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    })

    return promise2;
  }
  
  // catch 方法：处理错误，实际上是 then 的语法糖
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
```

## 使用示例

```javascript
// 创建一个异步 Promise
new MyPromise((resolve, reject) => {
  setTimeout(() => reject('异步失败'), 1000); // 1秒后触发失败
}).then(res => {
  console.log(res);
  return '链式调用';
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err) // 1秒后输出"异步失败"
})
```

## 实现特点

1. **状态管理**
   - 维护了 Promise 的三种状态：pending、fulfilled、rejected
   - 状态一旦改变就不可逆

2. **异步支持**
   - 使用回调数组存储异步操作的回调函数
   - 通过 setTimeout 确保异步执行

3. **链式调用**
   - then 方法返回新的 Promise
   - 支持多次链式调用

4. **错误处理**
   - 实现了 catch 方法
   - 完整的错误捕获机制

## 注意事项

1. 这个实现是 Promise/A+ 规范的简化版本
2. 实际的 Promise 还包含 `all`、`race`、`finally` 等方法
3. 生产环境建议使用原生 Promise 或成熟的实现库
4. 这个实现主要用于学习和理解 Promise 的工作原理

## 进阶优化方向

1. 添加 Promise 的静态方法（all、race、resolve、reject 等）
2. 实现 finally 方法
3. 完善与 Promise/A+ 规范的一致性
4. 添加更完善的类型检查和错误处理
