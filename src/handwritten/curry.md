# JavaScript 柯里化函数实现

## 一、函数定义

```javascript
function curry(fn) {
  // 获取目标函数的参数数量
  const arity = fn.length;

  // 返回一个闭包函数，用于收集参数
  return function curried(...args) {
    // 如果收集的参数数量已经达到目标函数的参数数量
    if (args.length >= arity) {
      // 调用目标函数并返回结果
      return fn.apply(this, args);
    } else {
      // 返回一个新的函数，继续收集参数
      return function (...nextArgs) {
        // 合并已有的参数和新传入的参数
        return curried.apply(this, [...args, ...nextArgs]);
      };
    }
  };
}
```

## 二、实现解析

### 1. 核心逻辑
- 获取原函数的参数数量（`fn.length`）
- 通过闭包保存已收集的参数
- 递归返回新函数继续收集参数
- 参数数量满足时执行原函数

### 2. 关键步骤
1. **参数收集**
   - 使用剩余参数（`...args`）收集传入的参数
   - 通过闭包保存已收集的参数

2. **参数判断**
   - 比较已收集参数数量与目标函数参数数量
   - 决定是执行函数还是继续收集参数

3. **参数合并**
   - 使用展开运算符合并新旧参数
   - 保持参数顺序正确

## 三、使用示例

### 1. 基础使用
```javascript
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

// 使用方式
curriedAdd(1)(2)(3);    // 6
curriedAdd(1, 2)(3);    // 6
curriedAdd(1)(2, 3);    // 6
```

### 2. 实际应用
- 函数组合
- 参数复用
- 延迟执行

## 四、注意事项

### 1. 参数数量
- 依赖 `fn.length` 获取参数数量
- 不适用于使用剩余参数的函数

### 2. 性能考虑
- 每次调用都会创建新的闭包
- 大量参数时可能影响性能

### 3. 使用场景
- 适合参数数量固定的函数
- 需要部分应用参数的场景