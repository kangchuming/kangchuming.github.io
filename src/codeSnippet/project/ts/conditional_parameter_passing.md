# 条件参数传递写法详解

在实际开发中，接口参数有时需要根据条件动态传递。下面以 `$getNextRecord` 方法为例，详细说明如何优雅地实现条件参数传递。

## 代码示例

```javascript
$getNextRecord({
  quizId,                                    // 固定参数
  curQuizAnswerId: aid,                     // 固定参数
  isNext: isNext ? 1 : 0,                  // 条件转换参数
  ...(lockQuestionIndex > -1 ? { curQuestionNum: lockQuestionIndex } : {}),  // 条件参数1
  ...(courseId ? { courseId } : {}),        // 条件参数2
})
```

## 核心原理

### 1. 扩展运算符（Spread Operator）
扩展运算符 `...` 允许将一个对象的所有属性展开到另一个对象中，这是ES6的重要特性。

### 2. 条件运算符（Conditional Operator）
条件运算符 `? :` 根据条件返回不同的值，格式为：`条件 ? 值1 : 值2`

### 3. 对象展开语法
当条件为真时展开包含属性的对象，为假时展开空对象，从而实现条件性添加属性。

## 参数传递逻辑详解

### 固定参数
```javascript
quizId,                                    // 始终传递
curQuizAnswerId: aid,                     // 始终传递
isNext: isNext ? 1 : 0,                  // 根据isNext值转换为0或1
```

### 条件参数1：lockQuestionIndex
```javascript
...(lockQuestionIndex > -1 ? { curQuestionNum: lockQuestionIndex } : {})
```

**逻辑说明：**
- 当 `lockQuestionIndex > -1` 为真时，展开 `{ curQuestionNum: lockQuestionIndex }`
- 当 `lockQuestionIndex > -1` 为假时，展开空对象 `{}`（相当于不添加任何属性）

**应用场景：** 只有在锁定问题索引有效时才传递当前问题编号

### 条件参数2：courseId
```javascript
...(courseId ? { courseId } : {})
```

**逻辑说明：**
- 当 `courseId` 存在且为真值时，展开 `{ courseId }`
- 当 `courseId` 不存在或为假值时，展开空对象 `{}`

**应用场景：** 只有在课程ID存在时才传递课程相关信息

## 实际效果演示

### 场景1：所有条件都满足
```javascript
// 输入值
const quizId = "123";
const aid = "456";
const isNext = true;
const lockQuestionIndex = 2;
const courseId = "789";

// 最终参数对象
{
  quizId: "123",
  curQuizAnswerId: "456",
  isNext: 1,
  curQuestionNum: 2,
  courseId: "789"
}
```

### 场景2：部分条件不满足
```javascript
// 输入值
const quizId = "123";
const aid = "456";
const isNext = false;
const lockQuestionIndex = -1;  // 不满足条件
const courseId = null;         // 不满足条件

// 最终参数对象
{
  quizId: "123",
  curQuizAnswerId: "456",
  isNext: 0
  // 注意：curQuestionNum 和 courseId 不会被包含
}
```

## 传统写法对比

### 传统if-else写法
```javascript
let params = {
  quizId,
  curQuizAnswerId: aid,
  isNext: isNext ? 1 : 0
};

if (lockQuestionIndex > -1) {
  params.curQuestionNum = lockQuestionIndex;
}

if (courseId) {
  params.courseId = courseId;
}

$getNextRecord(params);
```

### 现代扩展运算符写法
```javascript
$getNextRecord({
  quizId,
  curQuizAnswerId: aid,
  isNext: isNext ? 1 : 0,
  ...(lockQuestionIndex > -1 ? { curQuestionNum: lockQuestionIndex } : {}),
  ...(courseId ? { courseId } : {}),
});
```

## 优势分析

### 1. 代码简洁性
- 避免了多个if语句
- 减少了临时变量的使用
- 代码更加紧凑易读

### 2. 可读性
- 条件逻辑一目了然
- 参数结构清晰明确
- 减少了代码嵌套

### 3. 性能优化
- 避免了传递不必要的参数
- 减少了对象属性的动态添加/删除
- 更符合函数式编程理念

### 4. 维护性
- 修改条件逻辑时只需要改一行
- 减少了代码重复
- 降低了出错概率

## 适用场景

### 1. API接口调用
```javascript
// 根据用户权限传递不同参数
fetch('/api/data', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    ...(user.isAdmin ? { adminMode: true } : {}),
    ...(user.preferences ? { preferences: user.preferences } : {})
  })
});
```

### 2. 组件属性传递
```javascript
// React组件中条件传递props
<MyComponent
  title={title}
  {...(isLoading ? { loading: true } : {})}
  {...(error ? { error } : {})}
  {...(onClick ? { onClick } : {})}
/>
```

### 3. 配置对象构建
```javascript
// 根据环境构建配置
const config = {
  baseURL: process.env.API_URL,
  timeout: 5000,
  ...(process.env.NODE_ENV === 'development' ? { debug: true } : {}),
  ...(process.env.API_KEY ? { apiKey: process.env.API_KEY } : {})
};
```

## 注意事项

### 1. 条件判断的准确性
确保条件表达式能够正确判断参数是否存在或有效。

### 2. 空值处理
注意区分 `null`、`undefined`、空字符串等不同情况。

### 3. 浏览器兼容性
扩展运算符需要ES6+环境支持，在旧版浏览器中可能需要Babel转译。

### 4. 性能考虑
虽然代码更简洁，但在极高频调用场景下，条件运算符的重复计算可能影响性能。

## 总结

条件参数传递是现代JavaScript开发中的一种优雅写法，它结合了扩展运算符和条件运算符的优势，让代码更加简洁、可读和易维护。掌握这种写法可以显著提升代码质量，是现代前端开发者的必备技能。

通过合理使用条件参数传递，我们可以：
- 减少代码重复
- 提高代码可读性
- 优化性能表现
- 增强代码维护性

这种模式在API调用、组件开发、配置管理等场景中都有广泛应用，值得深入学习和掌握。
