以下是一个简单的 `SimplePromise` 类的实现，以及如何使用它的示例：

```javascript
class SimplePromise {
  constructor(executor) {
      this.status = 'pending'; // 初始状态
      this.value = undefined; // fulfilled状态时 返回的信息
      this.reason = undefined; // rejected状态时 拒绝的原因

      // 成功态
      let resolve = value => {
          if (this.status === 'pending') {
              this.status = 'fulfilled';
              this.value = value;
          }
      };
      // 失败态
      let reject = reason => {
          if (this.status === 'pending') {
              this.status = 'rejected';
              this.reason = reason;
          }
      };

      try {
          executor(resolve, reject);
      } catch (err) {
          reject(err);
      }
  }

  // then方法
  then(onFulfilled, onRejected) {
      if (this.status === 'fulfilled') {
          onFulfilled(this.value);
      }
      if (this.status === 'rejected') {
          onRejected(this.reason);
      }
  }
}

let p1 = new SimplePromise((resolve, reject) => {
  resolve('Promise is resolved');
}).then(value => {
  console.log(value);
}, reason => {
  console.log(reason);
})