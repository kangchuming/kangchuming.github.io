## 错误边界

### 使用场景
- 异步数据获取失败
- 组件渲染过程中的错误
- 第三方库的错误
- 需要优雅降级的场景

### 原理
当调用 showBoundary(error) 时，React 会：
- 停止渲染发生错误的组件树
- 卸载发生错误的组件
- 渲染 FallbackComponent 组件
- 将错误信息传递给 FallbackComponent

### 注意点
需要注意的是，错误边界只能捕获：
- 渲染过程中的错误
- 生命周期方法中的错误
- 构造函数中的错误
  
它不能捕获：
- 事件处理器中的错误
- 异步代码中的错误（如 setTimeout、Promise 等）
- 服务端渲染中的错误
- 错误边界组件自身的错误

### 代码
```
import { useErrorBoundary, ErrorBoundary  } from 'react-error-boundary';
import { useEffect } from 'react';

// 错误展示组件
function Fallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" style={{ padding: '20px', border: '1px solid red', borderRadius: '4px' }}>
            <h2>出错了！</h2>
            <p>错误信息：</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>重试</button>
        </div>
    );
}

// 示例组件
function ExampleComponent() {
    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        // 模拟异步操作
        const fetchData = async () => {
            try {
                // 这里模拟一个可能失败的API调用
                const response = await fetch('https://api.example.com/data');
                if (!response.ok) {
                    throw new Error('API请求失败');
                }
                const data = await response.json();
                // 处理数据...
            } catch (error) {
                // 使用 showBoundary 触发错误边界
                showBoundary(error);
            }
        };

        fetchData();
    }, [showBoundary]);

    return <div>加载中...</div>;
}

// 使用错误边界包装组件
function App() {
    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onReset={() => {
                // 重置错误状态
                console.log('重置错误状态');
            }}
        >
            <ExampleComponent />
        </ErrorBoundary>
    );
}

export default App;
```