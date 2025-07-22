
---

# 弹窗自适应、遮罩与 Flex 布局总结

## 1. 弹窗宽度自适应

- **父级弹窗**：建议使用固定宽度 + `max-width`，保证在大屏和小屏下都能自适应。
  - 示例：`width: 600px; max-width: 90vw;`
- **子元素**：宽度用百分比或 `flex`，不要用 `vw` 单位，避免小屏下溢出。
  - 推荐：`display: flex;` 或 `width: 50%;`
- **图片、表格等内容**：加 `max-width: 100%`，防止超出父级。
- **响应式优化**：小屏下用媒体查询调整布局，比如改为纵向排列。

### 总结
- 父级用固定宽度+max-width，子元素用flex或百分比，不要用vw。
- 所有内容加 max-width: 100%，防止溢出。
- 小屏下用媒体查询调整布局，体验更好。

---

## 2. 遮罩层（.modalMask）原理

- `position: fixed; inset: 0;`：让遮罩层覆盖整个视口。
- `background: rgba(0,0,0,0.4);`：半透明黑色背景，突出弹窗内容。
- `z-index: 9998;`：保证遮罩层在最上层。
- `display: flex; align-items: center; justify-content: center;`：让弹窗内容居中。

### 视觉效果
- 遮罩层盖住整个页面，用户只能操作弹窗，页面内容变暗但可见。

---

## 3. 弹窗弹出时页面无法滚动的原理

- 弹窗显示时，通常给 `<body>` 或 `<html>` 加 `overflow: hidden`，隐藏滚动条，禁止页面滚动。
- 遮罩层本身不会阻止滚动，真正阻止滚动的是 `body` 的 `overflow: hidden`。
- 移动端可监听 `touchmove` 阻止默认行为，防止滚动穿透。

### 代码示例
```js
// 弹窗打开
document.body.style.overflow = 'hidden';
// 弹窗关闭
document.body.style.overflow = '';
```

### 总结
- 无法滚动的原理：弹窗弹出时，body 被加上 overflow: hidden，页面滚动条消失，无法滚动。
- 这样可以防止页面滚动穿透，保证弹窗体验。

---

## 4. Flex 布局基础与常见写法

- 只有父元素设置了 `display: flex`，子元素的 `flex` 属性才生效。
- `flex` 是 `flex-grow flex-shrink flex-basis` 的简写。

### 常见写法与含义

| 写法                | grow | shrink | basis  | 说明           |
|---------------------|------|--------|--------|----------------|
| flex: 1;            | 1    | 1      | 0%     | 等分剩余空间   |
| flex: 2;            | 2    | 1      | 0%     | 占两倍空间     |
| flex: none;         | 0    | 0      | auto   | 不伸缩         |
| flex: auto;         | 1    | 1      | auto   | 内容宽度可伸缩 |
| flex: 0 0 200px;    | 0    | 0      | 200px  | 固定宽度       |

#### 例子
- `flex: 0 0 268px;`：宽度固定为 268px，不会伸缩，常用于侧栏。
- `flex: 1;`：等分剩余空间，常用于自适应布局。

### 详细讲解
- **flex-grow**：放大比例，决定多余空间如何分配，默认0。
- **flex-shrink**：缩小比例，决定空间不足时如何缩小，默认1。
- **flex-basis**：主轴初始尺寸，通常是宽度，默认auto。

---

## 5. 响应式优化建议

- 小屏下用媒体查询调整布局，如改为纵向排列。
- 父级用固定宽度+max-width，子元素用flex或百分比，不要用vw。
- 所有内容加 max-width: 100%，防止溢出。

---

## 6. 常见问题答疑

### Q1: 需要 display: flex 才能用 flex 属性吗？
A: 是的，只有父元素 display: flex，子元素的 flex 属性才生效。

### Q2: flex: 0 0 268px; 是什么意思？
A: 固定宽度 268px，不会放大也不会缩小，常用于侧栏等固定宽度场景。

### Q3: 弹窗弹出时为什么页面无法滚动？
A: 因为 JS 自动给 body 加了 overflow: hidden，禁止页面滚动，防止滚动穿透。

---

## 7. 总结

- 弹窗自适应：父级用固定宽度+max-width，子级用flex/百分比，内容加max-width: 100%。
- 遮罩层原理：position: fixed + inset: 0 + 半透明背景 + z-index。
- 禁止滚动：弹窗弹出时给body加overflow: hidden。
- Flex布局：父级display: flex，子级flex属性控制伸缩与宽度。
- 响应式优化：媒体查询+flex/百分比，避免vw单位。

---
