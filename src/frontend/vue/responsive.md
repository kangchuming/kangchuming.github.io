# Vue2 响应式原理详解

## 一、核心实现机制

Vue2 通过 **数据劫持 + 依赖收集 + 发布订阅模式** 实现响应式，主要包含以下三个核心部分：

### 1. 数据劫持（Object.defineProperty）

#### 1.1 对象劫持
```javascript
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log('读取属性', key);
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      console.log('更新属性', key);
      val = newVal;
    }
  });
}
```

#### 1.2 数组劫持
- 重写数组的 7 个变异方法：
  - push
  - pop
  - shift
  - unshift
  - splice
  - sort
  - reverse

### 2. 依赖收集（Dep 类）

```javascript
class Dep {
  constructor() {
    this.subs = [];
  }
  
  addSub(watcher) {
    this.subs.push(watcher);
  }
  
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}
```

### 3. 观察者（Watcher 类）
- 每个组件对应一个 Watcher 实例
- 负责监听数据变化并触发重新渲染
- 初始化时触发 get，将自身添加到当前属性的 Dep 中

## 二、响应式流程

1. **初始化数据**
   - 递归遍历数据
   - 劫持所有属性的 get/set

2. **模板编译**
   - 解析模板
   - 找到依赖的数据
   - 创建 Watcher

3. **依赖收集**
   - 首次渲染时触发 get
   - 将 Watcher 添加到对应属性的 Dep 中

4. **数据更新**
   - 属性被修改时触发 set
   - 调用 Dep.notify() 通知所有 Watcher
   - Watcher 更新视图

## 三、响应式系统的缺陷

### 1. 对象属性的新增/删除无法检测

#### 问题原因
- Object.defineProperty 只能劫持已存在的属性

#### 解决方案
```javascript
// 错误方式
this.obj.newKey = 'value';

// 正确方式
Vue.set(this.obj, 'newKey', 'value');
```

### 2. 数组索引和长度修改无法检测

#### 问题原因
- 直接通过索引修改或修改 length 不会触发更新

#### 解决方案
```javascript
// 错误方式
this.arr[0] = 'newValue';
this.arr.length = 2;

// 正确方式
this.arr.splice(0, 1, 'newValue');
Vue.set(this.arr, 0, 'newValue');
```

### 3. 初始化性能问题

#### 问题原因
- 递归遍历所有属性
- 对深层嵌套对象性能较差

#### 影响
- 深层嵌套对象或大数组可能导致初始化卡顿

### 4. 不支持 Map/Set 等新数据类型

#### 问题原因
- 响应式系统仅针对普通对象和数组设计

#### 解决方案
- 手动实现响应式
- 使用 Vue3（基于 Proxy）

### 5. 无法监听动态新增的根级响应式属性

#### 问题原因
- 响应式系统在初始化时已处理数据
- 后续新增的根级属性不会被劫持

#### 示例
```javascript
data() {
  return { a: 1 };
},
created() {
  // 无法触发更新
  this.b = 2;
}
```

## 四、总结

1. **核心机制**
   - 数据劫持：通过 Object.defineProperty 实现
   - 依赖收集：通过 Dep 类管理依赖
   - 发布订阅：通过 Watcher 实现更新

2. **主要缺陷**
   - 无法检测对象属性的新增/删除
   - 无法检测数组索引和长度的修改
   - 初始化性能问题
   - 不支持新数据类型
   - 无法监听动态新增的根级属性

3. **解决方案**
   - 使用 Vue.set/Vue.delete
   - 使用数组变异方法
   - 考虑使用 Vue3 的 Proxy 实现