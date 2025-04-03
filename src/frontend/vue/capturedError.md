# Vue 2 错误边界实现指南

## 概述

在 Vue 2 中，虽然不像 React 那样有明确的 "Error Boundary" 概念，但可以通过 `errorCaptured` 生命周期钩子实现类似的错误边界机制。

## 实现方法

### 1. 使用 errorCaptured 钩子

在父组件中定义 `errorCaptured` 钩子，用于捕获子组件的错误：

```javascript
export default {
  data() {
    return {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  },
  errorCaptured(err, vm, info) {
    // 捕获错误，更新状态
    this.hasError = true;
    this.error = err;
    this.errorInfo = info;

    // 返回 false 阻止错误继续向上传播
    return false;
  },
  // 可选：全局错误处理（Vue.config.errorHandler）
};
```

### 2. 渲染降级 UI

根据错误状态显示备用内容：

```html
<template>
  <div>
    <div v-if="hasError" class="error-message">
      <h1>Something went wrong!</h1>
      <p>{{ error }}</p>
    </div>
    <slot v-else></slot>
  </div>
</template>
```

### 3. 封装为通用组件（ErrorBoundary）

将逻辑封装成可复用的 ErrorBoundary 组件：

```javascript
// ErrorBoundary.vue
export default {
  data() {
    return {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  },
  errorCaptured(err, vm, info) {
    this.hasError = true;
    this.error = err;
    this.errorInfo = info;
    return false; // 阻止向上冒泡
  },
  render(h) {
    if (this.hasError) {
      return h('div', { class: 'error-boundary' }, [
        h('h1', 'An error occurred'),
        h('pre', this.error.toString()),
      ]);
    }
    return this.$slots.default[0]; // 渲染默认插槽内容
  },
};
```

### 4. 使用错误边界包裹组件

在需要保护的组件外层使用 ErrorBoundary：

```html
<template>
  <error-boundary>
    <my-child-component/>
  </error-boundary>
</template>
```

## 注意事项

### 可捕获的错误类型

- 子组件的渲染函数错误（如 template 或 render）
- 子组件的生命周期钩子中的错误（如 created, mounted）
- 子组件的 watcher 回调中的错误

### 无法捕获的场景

- 事件处理函数中的异步错误（需手动 try/catch 或全局处理）
- 异步代码（如 setTimeout, Promise）中的错误
- 自身组件的错误（错误边界仅捕获子组件错误）

### 结合全局错误处理

```javascript
// 全局捕获未处理的错误
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Global Error:', err, info);
};
```

## 完整示例

```vue
<template>
  <div class="error-boundary-container">
    <div v-if="hasError" class="error-ui">
      <h2>组件发生错误</h2>
      <details>
        <summary>查看错误详情</summary>
        <p>错误信息: {{ error && error.message }}</p>
        <p>来源: {{ errorInfo }}</p>
      </details>
      <button @click="reset">重试</button>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false,
      error: null,
      errorInfo: null
    };
  },
  methods: {
    reset() {
      this.hasError = false;
      this.error = null;
      this.errorInfo = null;
    }
  },
  errorCaptured(err, vm, info) {
    this.hasError = true;
    this.error = err;
    this.errorInfo = info;
    
    // 可以在这里记录错误到日志服务
    console.error(`Error captured in component: ${vm.$options.name || 'Anonymous'}`);
    
    // 返回 false 阻止向上传播
    return false;
  }
};
</script>

<style scoped>
.error-ui {
  padding: 20px;
  border: 1px solid #f56c6c;
  border-radius: 4px;
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
```

## 总结

Vue 2 通过 `errorCaptured` 钩子实现错误边界，能有效隔离子组件错误并展示降级 UI，但需注意其局限性。对于异步和事件错误，需结合全局处理或手动捕获。

## 与 Vue 3 的区别

在 Vue 3 中，`errorCaptured` 钩子的工作方式基本相同，但有以下变化：

- 作为 `setup` 函数中的生命周期钩子使用 `onErrorCaptured`
- 错误处理能力有所增强，特别是对于异步组件
- 可以更好地与 Composition API 结合使用

## 最佳实践

1. **分层使用错误边界**：在应用的不同层级添加错误边界，避免整个应用崩溃
2. **提供有意义的错误信息**：错误 UI 应该提供有用的信息和可能的恢复操作
3. **记录错误日志**：将捕获的错误发送到日志系统，方便后续分析
4. **结合全局错误处理**：使用 `Vue.config.errorHandler` 捕获遗漏的错误
5. **区分开发和生产环境**：在开发环境显示详细错误，生产环境仅显示用户友好信息