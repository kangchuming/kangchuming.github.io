## Ant Design 样式修改问题及解决方案

### Situation（情境）
在使用 Ant Design 组件库开发项目时，经常会遇到需要修改组件默认样式的情况。由于 Ant Design 的样式是通过 CSS-in-JS 的方式实现的，直接修改组件样式可能会遇到困难。

### Task（任务）
需要修改 Ant Design 组件的默认样式，同时避免全局样式污染，确保样式的可维护性和可预测性。

### Action（行动）
1. 问题分析：
   - 直接使用 `:global(.ant-xxx)` 的方式修改样式会导致全局污染
   - 样式优先级问题可能导致修改不生效
   - 多个组件使用相同类名时会产生冲突

2. 解决方案：
   ```css
   /* 不推荐的方式 */
   :global(.ant-btn) {
     background-color: red !important;
   }

   /* 推荐的方式 */
   .custom-wrapper {
     :global {
       .ant-btn {
         background-color: red;
       }
     }
   }
   ```

3. 关于 `!important` 的使用说明：
   - 为什么需要 `!important`：
     - Ant Design 的样式是通过 CSS-in-JS 动态生成的，具有较高的优先级
     - 组件库内部可能使用了多层嵌套的选择器，增加了样式权重
     - 某些样式可能被组件库的 JavaScript 动态覆盖
   
   - `!important` 的注意事项：
     - 虽然能强制覆盖样式，但会破坏 CSS 的级联规则
     - 过度使用会导致样式难以维护和调试
     - 可能影响其他开发者的样式覆盖
     - 建议仅在确实无法通过其他方式覆盖样式时使用

4. 最佳实践：
   - 优先使用 CSS Modules 进行样式隔离
   - 通过父级类名限制样式作用域
   - 使用 styled-components 或 emotion 等 CSS-in-JS 解决方案
   - 利用 Ant Design 提供的 `className` 和 `style` 属性
   - 如果必须使用 `!important`，建议添加注释说明原因

### Result（结果）
1. 优点：
   - 样式作用域得到有效控制
   - 避免了全局样式污染
   - 提高了代码可维护性
   - 组件样式更加可预测

2. 注意事项：
   - 合理使用 CSS 选择器优先级
   - 遵循 Ant Design 的设计规范
   - 保持样式的可复用性
   - 注意性能影响

### 示例代码
```tsx
// 组件中使用
import styles from './CustomComponent.module.css';

const CustomComponent = () => {
  return (
    <div className={styles.wrapper}>
      <Button type="primary">自定义按钮</Button>
    </div>
  );
};

// CSS Module 文件
.wrapper {
  :global {
    .ant-btn {
      background-color: #1890ff;
      border-radius: 4px;
      
      &:hover {
        background-color: #40a9ff;
      }
    }
  }
}
```

### 总结
通过合理使用 CSS Modules 和样式作用域限制，我们可以有效地修改 Ant Design 组件的样式，同时避免全局样式污染。这种方式既保证了样式的可维护性，又不会影响其他组件的样式表现。 