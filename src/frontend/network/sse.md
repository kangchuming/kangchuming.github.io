# Server-Sent Events (SSE)

## 概述

Server-Sent Events（SSE）是一种基于 HTTP 的协议，允许服务器主动向客户端推送实时数据。它常用于实现单向实时通信（服务器到客户端），例如实时通知、股票行情、新闻推送等场景。SSE 基于长连接（long-polling）机制，客户端通过一次 HTTP 请求建立连接后，服务器可以持续发送数据。

## 核心特性

- **单向通信**：仅服务器向客户端推送数据
- **基于 HTTP**：无需复杂协议，兼容现有基础设施
- **自动重连**：客户端在网络中断后会自动尝试重新连接
- **轻量级**：比 WebSocket 更简单，适合简单实时场景
- **文本协议**：数据以纯文本格式传输（支持 UTF-8）

## 工作流程

### 1. 客户端发起请求

客户端通过 EventSource API 向服务器发送一个 HTTP GET 请求，表明它希望接收事件流。

```javascript
const eventSource = new EventSource('/sse-endpoint');
```

### 2. 服务器响应

服务器返回一个 HTTP 响应，标头中声明内容类型为 `text/event-stream`，并保持连接打开。

### 3. 持续推送数据

服务器通过保持打开的连接，以特定格式（`data: ...`）持续发送事件。

## 请求头与响应头

### 客户端请求头（Client Headers）

客户端（浏览器）发起 SSE 请求时，默认会包含以下标头：

- **Accept**: `text/event-stream` - 表明客户端期望接收事件流格式的数据
- **Connection**: `keep-alive` - 保持长连接，确保连接不立即关闭
- **Cache-Control**: `no-cache` - 禁用缓存，确保获取实时数据

#### 示例请求头

```http
GET /sse-endpoint HTTP/1.1
Host: example.com
Accept: text/event-stream
Connection: keep-alive
Cache-Control: no-cache
```

### 服务器响应头（Server Headers）

服务器必须返回以下标头以支持 SSE：

- **Content-Type**: `text/event-stream` - 关键标头，声明响应内容是事件流
- **Connection**: `keep-alive` - 保持连接处于打开状态
- **Cache-Control**: `no-cache` - 防止中间代理或浏览器缓存数据
- **Transfer-Encoding**: `chunked`（可选） - 启用分块传输编码，适用于持续发送数据

#### 可选标头

- **Retry**: `<milliseconds>` - 指定客户端在断开后重新连接的等待时间（例如 `Retry: 3000`）

#### 示例响应头

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Connection: keep-alive
Cache-Control: no-cache
```

## 数据格式

服务器发送的数据需遵循特定格式，每条消息以空行（`\n\n`）结尾：

各字段说明：

- **data**: 消息内容（可多行，合并后以换行符连接）
- **event**: 自定义事件类型（客户端需监听特定事件名）
- **id**: 消息的唯一标识符，用于断线重连后同步
- **retry**: 覆盖客户端的默认重连时间

## 注意事项

- **跨域问题**：SSE 默认遵守同源策略，跨域需配置 CORS
- **最大连接数**：浏览器对每个源的并发 SSE 连接数有限制（通常为 6）
- **协议兼容性**：SSE 不支持 IE，但可通过 Polyfill 兼容旧浏览器