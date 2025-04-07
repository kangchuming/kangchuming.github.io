# JavaScript EventEmitter 实现

## 概述

EventEmitter（事件发射器）是一个实现发布-订阅模式的工具类，在 Node.js 中有广泛应用。它允许我们注册事件监听器，在特定事件发生时触发回调函数。以下是一个简洁而功能完整的 JavaScript EventEmitter 实现。

## 核心实现

```javascript
class EventEmitter {
  constructor() {
    this.event = {}; // 存储所有事件和对应的监听器
  }

  /**
   * 注册一个持久性事件监听器
   * @param {string} name - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(name, callback) {
    if (!this.event[name]) this.event[name] = [];
    this.event[name].push({ callback, once: false });
  }

  /**
   * 注册一个一次性事件监听器（触发一次后自动移除）
   * @param {string} name - 事件名称
   * @param {Function} callback - 回调函数
   */
  once(name, callback) {
    if (!this.event[name]) this.event[name] = [];
    this.event[name].push({ callback, once: true });
  }

  /**
   * 触发指定事件，执行所有注册的监听器
   * @param {string} name - 事件名称
   * @param {...any} args - 传递给监听器的参数
   */
  emit(name, ...args) {
    if (!this.event[name]) return;
    const listeners = this.event[name].slice(); // 复制数组，防止遍历时修改原数组
    const onceToRemove = new Set(); // 使用 Set 存储需要移除的一次性监听器

    // 执行所有监听器
    listeners.forEach(listener => {
      listener.callback(...args);
      if (listener.once) onceToRemove.add(listener);
    });

    // 移除已执行的一次性监听器
    this.event[name] = this.event[name].filter(
      listener => !onceToRemove.has(listener)
    );

    // 如果事件没有监听器了，删除该事件
    if (this.event[name]?.length === 0) delete this.event[name];
  }

  /**
   * 移除指定事件的特定监听器
   * @param {string} name - 事件名称
   * @param {Function} callback - 要移除的回调函数
   */
  off(name, callback) {
    if (!this.event[name]) return;
    this.event[name] = this.event[name].filter(
      listener => listener.callback !== callback
    );
    if (this.event[name].length === 0) delete this.event[name];
  }
}
```

## 使用示例

```javascript
// 创建事件发射器实例
const emitter = new EventEmitter();

// 注册持久性事件监听器
emitter.on('message', (text, sender) => {
  console.log(`收到消息: ${text} 来自 ${sender}`);
});

// 注册一次性事件监听器
emitter.once('welcome', (user) => {
  console.log(`欢迎 ${user} 加入!`);
});

// 触发事件
emitter.emit('message', 'Hello', 'Alice'); // 输出: 收到消息: Hello 来自 Alice
emitter.emit('welcome', 'Bob');            // 输出: 欢迎 Bob 加入!
emitter.emit('welcome', 'Charlie');        // 不会输出任何内容，因为监听器已被移除

// 移除特定监听器
const logError = (err) => console.error(err);
emitter.on('error', logError);
emitter.off('error', logError);            // 移除 logError 监听器
```

## 功能特点

1. **事件注册**
   - `on()`: 添加持久性事件监听器
   - `once()`: 添加一次性事件监听器

2. **事件触发**
   - `emit()`: 触发指定事件并传递参数

3. **事件移除**
   - `off()`: 移除特定事件的特定监听器

4. **优化设计**
   - 使用对象存储事件，O(1)时间复杂度查找
   - 使用 Set 高效管理一次性监听器的移除
   - 自动清理空事件，避免内存泄漏
   - 复制监听器数组，避免回调执行时修改数组引发问题

## 进阶扩展

可以为这个基础实现添加更多功能，例如：

1. `removeAllListeners(name?)`: 移除指定事件或所有事件的所有监听器
2. `listenerCount(name)`: 获取指定事件的监听器数量
3. `eventNames()`: 获取所有已注册的事件名称
4. `prependListener()`: 在监听器队列开头添加监听器
5. 添加最大监听器数量限制，防止内存泄漏

## 应用场景

1. 组件间通信
2. 异步事件处理
3. 用户交互响应
4. 消息队列和通知系统
5. 模块解耦

这个 EventEmitter 实现虽然简洁，但已经具备了核心功能，可以在各种场景中使用。