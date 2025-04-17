# Vue computed 与 watch 对比指南

## 一、核心概念

### 1. computed（计算属性）
- **本质**：声明式派生值
- **特点**：
  - 基于现有数据生成新值
  - 具有缓存机制
  - 纯同步操作
  - 返回单个值

### 2. watch（侦听器）
- **本质**：命令式副作用
- **特点**：
  - 监听数据变化执行操作
  - 无缓存机制
  - 支持异步操作
  - 可深度监听

## 二、使用场景

### 1. computed 适用场景
```javascript
// 1. 模板表达式简化
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}

// 2. 多数据派生
computed: {
  total() {
    return this.price * this.quantity;
  }
}

// 3. 数据过滤
computed: {
  filteredList() {
    return this.list.filter(item => item.isActive);
  }
}
```

### 2. watch 适用场景
```javascript
// 1. 异步操作
watch: {
  searchQuery(newVal) {
    this.debouncedFetchData(newVal);
  }
}

// 2. 复杂逻辑
watch: {
  formData: {
    handler(newVal) {
      this.validateForm(newVal);
    },
    deep: true
  }
}

// 3. 非数据操作
watch: {
  '$route'(to, from) {
    window.scrollTo(0, 0);
  }
}
```

## 三、特性对比

| 特性 | computed | watch |
|------|----------|-------|
| 目的 | 生成派生值 | 响应数据变化 |
| 返回值 | 必须返回 | 无返回值 |
| 缓存 | ✅ | ❌ |
| 异步 | ❌ | ✅ |
| 监听方式 | 自动追踪 | 显式指定 |
| 代码风格 | 声明式 | 命令式 |

## 四、最佳实践

### 1. 优先使用 computed
- 需要派生数据时
- 模板逻辑需要简化时
- 性能要求高时（利用缓存）

### 2. 使用 watch 的场景
- 需要执行异步操作
- 需要处理复杂逻辑
- 需要执行副作用

## 五、常见问题

1. **何时用 computed？**
   - 需要基于响应式数据生成新值
   - 该值会被模板或其他计算属性依赖
   - 例如：格式化数据、过滤列表、数学计算

2. **何时用 watch？**
   - 需要执行异步操作
   - 需要处理复杂逻辑
   - 需要执行非数据驱动的操作
   - 例如：API 请求、表单验证、DOM 操作

3. **为什么优先用 computed？**
   - 具有缓存机制，性能更优
   - 代码更简洁，声明式描述
   - 自动追踪依赖，维护成本低

## 六、总结

- **computed**：适合"我需要一个值"的场景
- **watch**：适合"当数据变化时，我要做某事"的场景
- 根据具体需求选择工具，避免滥用 watch