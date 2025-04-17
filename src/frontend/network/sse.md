# Server-Sent Events (SSE) 详解

## 一、概述

### 1. 基本概念
- 基于 HTTP 的服务器推送协议
- 实现单向实时通信（服务器 → 客户端）
- 基于长连接机制

### 2. 适用场景
- 实时通知
- 股票行情
- 新闻推送
- 简单实时数据流

## 二、核心特性

### 1. 通信特性
- 单向通信（服务器到客户端）
- 基于 HTTP 协议
- 自动重连机制
- 轻量级实现
- 文本协议（UTF-8）

### 2. 优势
- 简单易用
- 兼容性好
- 自动重连
- 资源消耗低

## 三、实现细节

### 1. 客户端实现
```javascript
// 基本连接
const eventSource = new EventSource('/sse-endpoint');

// 事件监听
eventSource.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};

// 错误处理
eventSource.onerror = (err) => {
  console.error('Connection error:', err);
  eventSource.close();
};
```

### 2. 服务端实现
```javascript
// 设置响应头
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

// 发送数据
res.write(`data: ${JSON.stringify(data)}\n\n`);
```

## 四、数据格式

### 1. 消息格式
```
event: <event-name>
id: <message-id>
data: <message-content>
retry: <retry-interval>
```

### 2. 字段说明
- **event**：自定义事件类型
- **id**：消息唯一标识
- **data**：消息内容
- **retry**：重连间隔

## 五、重连机制

### 1. 基本实现
```javascript
class SSEHandler {
  constructor(url, maxRetries = 5) {
    this.url = url;
    this.maxRetries = maxRetries;
    this.retries = 0;
    this.connect();
  }

  connect() {
    this.eventSource = new EventSource(this.url);
    
    this.eventSource.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };

    this.eventSource.onerror = () => {
      this.handleError();
    };
  }

  handleError() {
    this.eventSource.close();
    if (this.retries < this.maxRetries) {
      this.retries++;
      setTimeout(() => this.connect(), 1000 * Math.pow(2, this.retries));
    }
  }
}
```

### 2. 状态恢复
```javascript
// 客户端
function connectSSE(lastEventId = null) {
  const url = new URL('/sse-endpoint', window.location.href);
  if (lastEventId) {
    url.searchParams.append('lastEventId', lastEventId);
  }
  return new EventSource(url);
}

// 服务端
const lastEventId = req.headers['last-event-id'];
if (lastEventId) {
  // 从 lastEventId 开始发送数据
}
```

## 六、注意事项

### 1. 限制
- 跨域需配置 CORS
- 浏览器连接数限制（通常为 6）
- IE 不支持（需 Polyfill）

### 2. 最佳实践
- 合理设置重连策略
- 处理连接状态
- 实现状态恢复
- 错误日志记录

## 七、与 WebSocket 对比

### 1. 优势
- 实现简单
- 基于 HTTP
- 自动重连
- 资源消耗低

### 2. 劣势
- 单向通信
- 不支持二进制数据
- 连接数限制
- 兼容性问题