# React Fiber 详解

## 一、Fiber 要解决什么问题？

### 1. 问题背景
React 15 及之前版本使用递归对比虚拟 DOM，一旦开始无法中断，导致：
- 主线程阻塞：长时间任务导致动画卡顿、输入延迟
- 无法拆分任务：复杂组件树渲染时性能下降

### 2. 核心目标
- 实现可中断的异步渲染
- 提升用户体验（如优先处理用户交互）

## 二、Fiber 的核心机制

### 1. 数据结构：链表化
#### Fiber 节点
对应一个虚拟 DOM 节点，保存：
```javascript
{
  type: 组件类型,
  stateNode: 实例/DOM节点,
  child: 第一个子节点,
  sibling: 兄弟节点,
  return: 父节点,
  memoizedState: Hooks链表,
  effectTag: 副作用标记（增/删/改）,
  // ... 其他调度信息
}
```

#### 链表结构
- 通过 child, sibling, return 形成链表树
- 替代递归栈，支持暂停与恢复

### 2. 调度机制：分片与优先级
#### 时间切片（Time Slicing）
- 将渲染任务拆分为多个 5ms 的小任务
- 利用浏览器的空闲时间（requestIdleCallback 类似机制）

#### 优先级调度
- 6 种优先级（从高到低）：
  1. Immediate
  2. UserBlocking
  3. Normal
  4. Low
  5. Idle
  6. NoPriority
- 高优先级任务可打断低优先级任务（如用户点击打断渲染）

### 3. 双缓冲（Double Buffering）
- **Current Tree**：当前显示的 Fiber 树
- **WorkInProgress Tree**：正在构建的新树，完成后直接替换 Current Tree，减少界面闪烁

## 三、Fiber 工作流程（两阶段）

### 1. Reconciliation Phase（协调阶段）
- 可中断：遍历 Fiber 树，标记需要更新的节点（生成副作用链表）
- 对比新旧虚拟 DOM，计算差异（Diff 算法）

### 2. Commit Phase（提交阶段）
- 不可中断：一次性提交所有变更到真实 DOM
- 执行生命周期（如 componentDidUpdate）、副作用（useEffect）

## 四、Fiber 带来的新特性

### 1. 并发模式（Concurrent Mode）
- 允许 React 同时准备多个 UI 版本
- 按优先级渲染

### 2. Suspense
- 延迟加载组件
- 显示加载状态

### 3. Transition
- 区分紧急与非紧急更新
- 如输入框响应 vs 搜索结果渲染

## 五、高频面试题与答案

### 1. Fiber 是什么？解决了什么问题？
- React 的新协调算法
- 解决递归渲染阻塞主线程的问题
- 支持可中断异步渲染，提升用户体验

### 2. Fiber 如何实现可中断？
- 通过链表结构保存遍历进度
- 配合 requestIdleCallback 分片执行任务
- 记录当前处理节点，下次从中断处恢复

### 3. 双缓冲的作用是什么？
- WorkInProgress 树在后台构建
- 完成后直接替换 Current 树
- 避免中间状态导致的 UI 闪烁

### 4. 时间切片如何工作？
- 将任务拆分为小片
- 每片执行完检查剩余时间
- 若不足则让出主线程，等待下次空闲继续

### 5. React 如何调度不同优先级任务？
- 使用优先级队列
- 高优先级任务插队执行
- 低优先级任务可能被丢弃或重新调度

## 六、记忆技巧

### 1. 链表结构
- 想象成"任务待办清单"
- 可随时暂停，记录当前进度

### 2. 双缓冲
- 类比"双线写作"
- 先打草稿再誊写，避免涂改

### 3. 分片调度
- 类似"番茄工作法"
- 25 分钟工作 + 5 分钟休息，但这里每片 5ms