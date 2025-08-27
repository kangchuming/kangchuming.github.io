# 条件样式渲染 - classnames 使用指南

在前端开发中，经常需要根据不同的条件动态添加CSS类名。`classnames` 库提供了一种优雅的方式来处理条件样式。

## 安装

```bash
npm install classnames
# 或
yarn add classnames
# 或
pnpm add classnames
```

## 基本用法

```javascript
import classNames from 'classnames';

// 基础用法
className={classNames({
  [s.videoContainer]: true,  // 始终添加
  [s.pureVideo]: condition1, // 条件为真时添加
  [s.threeScreen]: condition2,
  [s.noRightPart]: condition3
})}
```

## 代码示例解析

```javascript
import classNames from 'classnames';

className={classNames({
  [s.videoContainer]: true,  // 固定样式，始终存在
  [s.pureVideo]: (getArgs('type') === '1' || (isInteractiveVideo() || !supportAi)) && showNativeSePlayer,
  [s.threeScreen]: isThreeScreen,
  [s.noRightPart]: ((getArgs('type') === '1' || isInteractiveVideo()) && !supportAi)
})}
```

### 样式类说明

- `videoContainer`: 基础容器样式，始终应用
- `pureVideo`: 纯视频模式样式，满足特定条件时应用
- `threeScreen`: 三屏模式样式，`isThreeScreen` 为真时应用
- `noRightPart`: 隐藏右侧部分样式，满足特定条件时应用

## 语法规则

### 1. 对象语法
```javascript
classNames({
  'class-name': boolean,  // 布尔值为真时添加类名
  'always': true,         // 始终添加
  'never': false          // 从不添加
})
```

### 2. 数组语法
```javascript
classNames([
  'base-class',
  condition && 'conditional-class',
  anotherCondition ? 'class-a' : 'class-b'
])
```

### 3. 混合语法
```javascript
classNames(
  'base-class',
  {
    'conditional': condition,
    'another': anotherCondition
  },
  ['array-classes']
)
```

## 实际应用场景

### 按钮样式
```javascript
const buttonClass = classNames({
  'btn': true,
  'btn-primary': type === 'primary',
  'btn-large': size === 'large',
  'btn-disabled': disabled
});
```

### 表单验证
```javascript
const inputClass = classNames({
  'form-input': true,
  'form-input-error': hasError,
  'form-input-success': isValid
});
```

### 响应式布局
```javascript
const containerClass = classNames({
  'container': true,
  'container-mobile': isMobile,
  'container-tablet': isTablet,
  'container-desktop': isDesktop
});
```

## 优势

1. **可读性强**: 条件逻辑清晰明了
2. **维护性好**: 修改条件时只需要改一处
3. **性能优化**: 避免了字符串拼接和条件判断
4. **类型安全**: 支持TypeScript类型检查

## 注意事项

- 确保CSS模块的类名正确引用
- 条件表达式要返回布尔值
- 避免过于复杂的嵌套条件
- 考虑使用常量来管理条件逻辑

## 总结

`classnames` 库是处理条件样式的优秀工具，通过对象语法可以清晰地表达复杂的样式逻辑，让代码更加易读和易维护。