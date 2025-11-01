## 手动实现useEffect

1. 代码
```js
// 存储每个 useEffect 的依赖数组（上一次渲染的值）
// 相当于 React 内部为每个 Hook 维护一块“记忆空间”
let lastDepsBox = [];

// 存储每个 useEffect 返回的清理函数（cleanup）
// 这样下一次依赖变化时，可以先执行清理逻辑
let lastClearCallbacks = [];

// 当前执行到第几个 useEffect —— 用来模拟 React 的“Hook 调用顺序”
let index = 0;

/**
 * 模拟 React 的 useEffect 实现
 * @param {Function} callback - 副作用函数 (可返回清理函数)
 * @param {Array} deps - 依赖数组
 */
function useEffect(callback, deps) {
  // 取出上一次的依赖
  let lastDeps = lastDepsBox[index];

  // 判断依赖是否变化
  // 情况1：首次渲染时 lastDeps 为 undefined
  // 情况2：没有传 deps（依赖每次都变化）
  // 情况3：某个依赖项与上一次不同
  let changed = (!deps || !lastDeps || deps.some((dep, i) => dep !== lastDeps[i]));

  // 如果依赖变化，或者是首次执行
  if (changed) {
    // 如果上一次执行时返回了清理函数，则先调用清理逻辑
    if (typeof lastClearCallbacks[index] === 'function') {
      lastClearCallbacks[index]();
    }

    // 执行本次的副作用函数
    // React 的 useEffect 会在 commit 阶段异步执行，这里简化为同步执行
    const cleanup = callback();

    // 如果 callback 返回了函数，说明它是清理函数（例如移除监听器）
    // 把它保存下来，供下一次调用前清理
    lastClearCallbacks[index] = typeof cleanup === 'function' ? cleanup : undefined;

    // 保存本次的依赖数组
    lastDepsBox[index] = deps;
  }

  // 当前 useEffect 执行完后，将全局 index 前进一位
  // 这样下一个 useEffect 调用就能对应到自己的“格子”
  index++;
}

/**
 * 模拟组件渲染
 * 每次渲染时，React 都会从头执行组件函数，
 * 所以必须重置 index，确保每个 useEffect 从头匹配。
 */
function render(component) {
  index = 0; // 每次渲染前重置 Hook 调用顺序
  component(); // 执行组件逻辑
}

```