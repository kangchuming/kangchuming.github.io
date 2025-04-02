# EventEmitter（事件发射器）实现

## 概述

EventEmitter 是一个事件管理器，实现了发布-订阅模式。它允许我们创建、监听和触发自定义事件，是 Node.js 中事件驱动架构的核心。

## 核心功能

1. **事件监听**：通过 `on` 方法添加事件监听器
2. **一次性监听**：通过 `once` 方法添加只执行一次的监听器
3. **事件触发**：通过 `emit` 方法触发事件并传递参数
4. **自动清理**：自动移除已执行的一次性监听器

## 代码实现

```javascript
class EventEmitter {
  constructor() {
    // 存储所有事件及其监听器
    this.event = {};
  }

  // 添加持续性事件监听器
  on(name, callback) {
    if (!this.event[name]) this.event[name] = [];
    this.event[name].push({ callback, once: false })
  }

  // 添加一次性事件监听器
  once(name, callback) {
    if (!this.event[name]) this.event[name] = [];
    this.event[name].push({ callback, once: true })
  }

  // 触发事件
  emit(name, ...args) {
    if(!this.event[name]) return;
    // 复制监听器数组，避免在遍历过程中修改原数组
    let listener = this.event[name].slice();
    let survivors = [];

    // 执行所有监听器
    listener.forEach((listener) => {
      listener.callback(...args);
      // 保留非一次性监听器
      if(!listener.once) survivors.push(listener);
    })

    // 更新监听器列表
    this.event[name] = survivors;
    // 如果没有监听器了，删除该事件
    if(this.event[name].length === 0) delete this.event[name];
  }

  //移除
  off = (name, callback) => {
  if (!this.events[name]) return;
  this.events[name] = this.events[name].filter(
    (listener) => listener.callback !== callback
  );
}
}
```

## 使用示例

```javascript
const emitter = new EventEmitter();

// 添加持续性事件监听器
emitter.on('message', (text, sender) => {
  console.log(`Received: ${text} from ${sender}`);
});

// 添加一次性事件监听器
emitter.once('greet', () => {
  console.log('Greeting received!');
});

// 触发事件
emitter.emit('message', 'Hello', 'Alice'); // 输出: Received: Hello from Alice
emitter.emit('greet');                     // 输出: Greeting received!
emitter.emit('greet');                     // 不会有输出，因为监听器已被移除
```

## 实现特点

1. **简单高效**
   - 使用对象存储事件和监听器
   - 支持多个监听器
   - 支持参数传递

2. **监听器管理**
   - 支持持续性监听器（`on`）
   - 支持一次性监听器（`once`）
   - 自动清理不再需要的监听器

3. **安全性考虑**
   - 复制监听器数组避免遍历时的修改问题
   - 检查事件是否存在
   - 自动清理空事件

## 进阶优化方向

1. **错误处理**
   - 添加错误事件处理
   - 增加参数验证

2. **功能扩展**
   - 实现 `off` 方法移除监听器
   - 实现 `removeAllListeners` 方法
   - 添加 `listenerCount` 方法

3. **性能优化**
   - 添加最大监听器数量限制
   - 优化内存使用
   - 添加事件名称验证

## 应用场景

1. **异步事件处理**
   - 处理用户交互
   - 处理网络请求响应
   - 处理文件操作回调

2. **模块间通信**
   - 组件间数据传递
   - 解耦模块依赖
   - 实现插件系统

3. **状态管理**
   - 监听状态变化
   - 触发更新操作
   - 实现观察者模式

## 注意事项

1. 避免过多的事件监听器导致内存泄漏
2. 注意事件名称的唯一性和规范性
3. 合理使用一次性监听器
4. 考虑在不需要时及时移除监听器 