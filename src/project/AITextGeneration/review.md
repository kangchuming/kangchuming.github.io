## AI流式图文生成

### 数据渲染卡

1. 防抖
使用背景：
- 用户输入文字时，频繁触发事件，导致频繁渲染，影响性能
- 只触发最后一次

```
const debounce = (fn, delay) = {
    let timer = null;

    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}
```



