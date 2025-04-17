# Vue 选项式 API 详解

## 一、核心选项

### 1. data
- **作用**：定义组件的响应式数据
- **要求**：必须是函数（返回对象）
- **示例**：
```javascript
data() {
  return { 
    count: 0 
  };
}
```

### 2. methods
- **作用**：定义组件的方法
- **特点**：无缓存，每次调用都会执行
- **示例**：
```javascript
methods: {
  increment() { 
    this.count++; 
  }
}
```

### 3. computed
- **作用**：基于依赖的响应式缓存值
- **适用场景**：复杂计算或数据派生
- **示例**：
```javascript
computed: {
  doubleCount() { 
    return this.count * 2; 
  }
}
```

### 4. watch
- **作用**：监听数据变化，执行异步或复杂操作
- **选项**：
  - deep：深度监听
  - immediate：立即执行
- **示例**：
```javascript
watch: {
  count: {
    handler(newVal, oldVal) { 
      /* 处理逻辑 */ 
    },
    deep: true,
    immediate: true
  }
}
```

## 二、生命周期钩子

### 1. 创建阶段
- **beforeCreate**：
  - 实例初始化前
  - 无法访问 data 和 methods
- **created**：
  - 实例创建完成
  - 可访问数据，但 DOM 未生成

### 2. 挂载阶段
- **beforeMount**：DOM 挂载前
- **mounted**：
  - DOM 挂载完成
  - 可操作 DOM 或发起异步请求

### 3. 更新阶段
- **beforeUpdate**：数据变化后，DOM 更新前
- **updated**：DOM 更新完成

### 4. 销毁阶段
- **beforeDestroy**：
  - 实例销毁前
  - 清理定时器或事件监听
- **destroyed**：实例销毁完成

## 三、组件通信

### 1. Props
- **作用**：父组件向子组件传递数据
- **示例**：
```javascript
props: {
  title: { 
    type: String, 
    required: true 
  }
}
```

### 2. Events
- **作用**：子组件向父组件通信
- **示例**：
```javascript
this.$emit('update', newValue);
```

### 3. 通信方式
- **父子组件**：props + $emit
- **兄弟组件**：事件总线或 Vuex
- **跨层级**：provide/inject

## 四、常见问题

### 1. 数据相关
- **Q**：为什么 data 必须是函数？
- **A**：避免多个实例共享同一数据对象，导致状态污染

### 2. 计算属性
- **Q**：computed 和 methods 的区别？
- **A**：
  - computed：有缓存，依赖不变时复用结果
  - methods：每次调用都会执行

### 3. 列表渲染
- **Q**：v-for 为什么需要 key？
- **A**：帮助 Vue 识别节点身份，优化虚拟 DOM 的更新效率

## 五、最佳实践

### 1. 数据管理
- 合理使用计算属性
- 避免深层嵌套对象
- 注意数据初始化开销

### 2. 性能优化
- 合理使用 watch 的 deep 选项
- 及时清理定时器和事件监听
- 避免不必要的组件重渲染

### 3. 组件设计
- 保持组件职责单一
- 合理使用组件通信方式
- 注意组件的可复用性