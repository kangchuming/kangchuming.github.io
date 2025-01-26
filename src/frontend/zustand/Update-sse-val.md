## 适用于SSE的状态更新
1. 新值
2. 更新值

**新值**
- 直接返回string

**更新值**
1. 接收数据 
```
await fetchEventSource(`${API_BASE_URL}/api/chat/paper/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),

            onmessage(event) {
                // 处理每个事件消息
                const text = event.data;
                console.log('Received:', text);

                // 更新 store 中的 paper 内容
                updatePaper((prevPaper) => prevPaper + text);
            },
```

2. 处理方法

```
类型定义
type Actions = {
  updateInputVal: (newInputVal: string | ((prev: string) => string)) => void
  updatePaper: (newPaper: string | ((prev: string) => string)) => void
}
```

```
处理函数
updatePaper: (newPaper: string | ((prev: string) => string)) =>
      set((state) => {
        state.paper = typeof newPaper === 'function'
          ? newPaper(state.paper)
          : newPaper;
      }),
```


- 情况1：传入字符串
updatePaper('新文本');  // typeof newPaper === 'string'

- 情况2：传入函数
updatePaper((prev) => prev + '新文本');  // typeof newPaper === 'function'