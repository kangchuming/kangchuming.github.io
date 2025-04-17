# Vue v-model 详解

## 一、基本原理

### 1. 本质
v-model 是 `value` 属性 + `input` 事件的语法糖，实现双向绑定。

### 2. 实现方式
```html
<!-- 简写 -->
<input v-model="message">

<!-- 等价写法 -->
<input 
  :value="message" 
  @input="message = $event.target.value"
>
```

## 二、自定义组件实现

### 1. 默认行为
```html
<!-- 父组件 -->
<ChildComponent v-model="message" />

<!-- 等价写法 -->
<ChildComponent 
  :value="message" 
  @input="message = $event"
/>
```

### 2. 自定义绑定
```javascript
Vue.component('CustomInput', {
  model: {
    prop: 'text',    // 修改默认 prop
    event: 'change'  // 修改默认事件
  },
  props: ['text'],
  template: `
    <input
      :value="text"
      @input="$emit('change', $event.target.value)"
    >
  `
});
```

## 三、多属性双向绑定

### 1. .sync 修饰符
```html
<!-- 父组件 -->
<ChildComponent 
  :title.sync="pageTitle" 
  :content.sync="pageContent"
/>

<!-- 等价写法 -->
<ChildComponent 
  :title="pageTitle" 
  @update:title="pageTitle = $event"
  :content="pageContent" 
  @update:content="pageContent = $event"
/>
```

### 2. 子组件触发更新
```javascript
this.$emit('update:title', newTitle);
this.$emit('update:content', newContent);
```

## 四、使用场景对比

| 场景 | 方法 | 特点 |
|------|------|------|
| 单个双向绑定 | v-model + model 选项 | 默认 value 和 input，可自定义 |
| 多个双向绑定 | .sync 修饰符 | 通过 update:propName 事件更新 |
| 原生表单元素 | v-model 直接使用 | 自动处理 value 和 input |

## 五、常见问题

1. **为什么默认使用 value 和 input？**
   - 与原生表单元素行为保持一致

2. **能否使用多个 v-model？**
   - Vue 2：不支持，需用 .sync
   - Vue 3：支持（如 v-model:title）

3. **如何监听变更？**
   - 子组件中通过 watch 监听 prop
   - 直接触发事件更新父组件数据

## 六、最佳实践

1. **简单场景**
   - 直接使用 v-model
   - 保持默认的 value 和 input

2. **复杂场景**
   - 使用 model 选项自定义
   - 多个属性使用 .sync

3. **性能优化**
   - 避免不必要的双向绑定
   - 合理使用计算属性