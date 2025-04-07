# 简单请求与复杂请求 (CORS)

跨源资源共享（CORS）是浏览器的一种安全机制，用于控制跨域请求。CORS 将跨域请求分为"简单请求"和"复杂请求"两类，它们的处理方式有显著差异。

## 一、简单请求（Simple Request）

简单请求无需预检，浏览器直接发送。满足以下**所有条件**的请求会被视为简单请求：

### 允许的 HTTP 方法

- GET
- POST
- HEAD

### 允许的请求头（Headers）

仅限以下标准头：
- Accept
- Accept-Language
- Content-Language
- Content-Type（仅限以下值）：
  - text/plain
  - multipart/form-data
  - application/x-www-form-urlencoded

### 限制条件

- 不能包含自定义的 HTTP 头（如 Authorization、X-* 等）

### 示例

```html
<!-- 表单提交（Content-Type 默认为 application/x-www-form-urlencoded） -->
<form action="https://api.example.com/data" method="POST"></form>
```

```javascript
// 简单请求示例
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
});
```

## 二、复杂请求（Complex Request）

不满足简单请求条件的请求会被视为复杂请求。浏览器会先发送一个 OPTIONS 预检请求，验证服务器是否允许实际请求，通过后才发送实际请求。

### 触发条件

- HTTP 方法：使用 PUT、DELETE、PATCH 等非简单方法。
- 自定义头：包含 Authorization、X-Custom-Header 等非简单头。
- Content-Type：如 application/json。
- 其他非标准配置（如 XMLHttpRequest 的 withCredentials 设置为 true）。

### 流程

浏览器发送 OPTIONS 预检请求，包含以下头信息：

- Access-Control-Request-Method: 声明实际请求的方法（如 PUT）。
- Access-Control-Request-Headers: 声明实际请求的自定义头（如 X-Custom-Header）。
- 服务器响应是否允许该请求（通过 Access-Control-Allow-* 头）。

预检通过后，浏览器发送实际请求。

### 示例

```javascript
// 发送 JSON 数据的 AJAX 请求
fetch('https://api.example.com/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ key: 'value' })
});
```

## 三、关键区别总结

特点	简单请求	复杂请求
预检请求（OPTIONS）	不需要	需要
HTTP 方法	GET、POST、HEAD	PUT、DELETE、PATCH 等
请求头	仅限简单头	可能包含自定义头（如 Authorization）
Content-Type	仅限表单类型	支持复杂类型（如 application/json）
安全性控制	浏览器直接发送	需服务器显式授权

## 四、常见问题

为什么需要预检请求？
出于安全考虑，防止恶意跨域请求滥用非标准方法或头信息。

如何避免复杂请求？

尽量使用简单请求的条件（如 POST + 表单类型）。

如果必须使用复杂请求，需确保服务器正确配置 CORS 响应头（如 Access-Control-Allow-Methods）。

服务器如何配置 CORS？

对预检请求的 OPTIONS 方法返回允许的方法和头。

在响应头中添加：

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

理解这两种请求类型，可以帮助开发者更好地处理跨域问题，优化 API 设计。