# 防抖函数在清空输入时的异常处理

## 问题描述
在实现实时搜索功能时，使用防抖函数处理输入变化，当用户快速删除输入内容时，可能会出现搜索结果异常的情况。

## 代码示例
```typescript
// 实时搜索，已做防抖处理1s
const handleSearchDebounce = debounce((value: string) => {
  onSearch?.(value);
}, 1000);

// 处理输入框变化（实时搜索）
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  if (value === '') {
    // 清空时立即触发搜索，不等待防抖
    handleSearchDebounce.cancel();
    onDelete?.('');
  } else {
    handleSearchDebounce(value);
  }
};
```

## 问题原因
1. 当用户快速删除输入内容时，防抖函数会捕获到删除过程中的某个中间状态
2. 由于防抖延迟（1秒），最后一个删除操作可能会被延迟执行
3. 这导致搜索结果可能显示的是删除过程中的某个中间值，而不是最终的空值

## 解决方案
在输入框被清空时（value === ''），立即取消最后一个防抖操作，并直接触发清空操作：
1. 使用 `handleSearchDebounce.cancel()` 取消待执行的防抖操作
2. 直接调用 `onDelete?.('')` 处理清空操作

## 最佳实践
1. 对于清空操作，应该立即执行而不是等待防抖
2. 在实现防抖功能时，需要考虑特殊情况的处理（如清空、取消等）
3. 合理使用防抖函数的 `cancel()` 方法来处理异常情况

## 总结
防抖函数虽然可以有效减少不必要的请求，但在处理特殊操作（如清空）时，需要特别注意处理方式。通过取消最后一个防抖操作，可以确保清空操作能够立即执行，避免出现搜索结果异常的情况。
