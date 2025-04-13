# Node.js 事件循环的六个阶段

## 1. Timers 阶段
- 处理 `setTimeout` 和 `setInterval` 的回调
- 检查定时器是否到期，执行对应的回调

## 2. Pending I/O Callbacks 阶段
- 执行系统操作的回调（如 TCP 错误）

## 3. Idle/Prepare 阶段
- Node.js 内部使用
- 通常无需关注

## 4. Poll 阶段
- 执行与 I/O 相关的回调（如文件读取、网络请求）
- 若队列为空：
  - 检查是否有 `setImmediate` 回调
    - 若有，进入 Check 阶段
    - 若无，等待新的 I/O 事件，或根据定时器到期时间决定是否跳转至 Timers 阶段

## 5. Check 阶段
- 执行 `setImmediate` 的回调

## 6. Close Callbacks 阶段
- 处理关闭事件的回调（如 `socket.on('close', ...)`）