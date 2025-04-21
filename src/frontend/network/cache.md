# HTTP 缓存机制详解

## 一、强缓存（Strong Cache）

### 1. 基本原理
- **定义**：浏览器直接使用本地缓存，不向服务器发送请求
- **实现方式**：通过 HTTP 头部的 Expires 或 Cache-Control 字段控制
- **优先级**：Cache-Control > Expires

### 2. 实现方式

#### 2.1 Expires（HTTP/1.0）
- **格式**：绝对时间（如 `Expires: Wed, 21 Oct 2025 07:28:00 GMT`）
- **缺点**：
  - 依赖客户端本地时间
  - 时间不准确可能导致缓存失效

#### 2.2 Cache-Control（HTTP/1.1）
- **常用指令**：
  - `max-age=3600`：资源有效期（秒）
  - `public`：允许代理服务器缓存
  - `private`：仅允许浏览器缓存
  - `no-cache`：跳过强缓存，进入协商缓存
  - `no-store`：禁用缓存
  - `immutable`：资源永不过期

### 3. 缓存流程
1. 浏览器请求资源
2. 检查 Cache-Control 或 Expires
3. 未过期 → 使用本地缓存（状态码 200 (from disk cache)）
4. 已过期 → 进入协商缓存

## 二、协商缓存（Conditional Cache）

### 1. 基本原理
- **定义**：强缓存失效时，向服务器验证资源是否更新
- **状态码**：
  - 未更新：304 Not Modified
  - 已更新：200 + 新资源

### 2. 实现方式

#### 2.1 Last-Modified & If-Modified-Since
- **Last-Modified**（响应头）：
  - 资源最后修改时间
  - 格式：`Last-Modified: Wed, 21 Oct 2023 05:28:00 GMT`

- **If-Modified-Since**（请求头）：
  - 携带 Last-Modified 值
  - 询问资源是否更新

- **缺点**：
  - 秒级精度限制
  - 修改时间更新但内容未变时失效

#### 2.2 ETag & If-None-Match
- **ETag**（响应头）：
  - 资源唯一标识符
  - 格式：`ETag: "a1b2c3"`

- **If-None-Match**（请求头）：
  - 携带 ETag 值
  - 验证资源是否变化

- **优点**：
  - 精准识别内容变化
  - 不受时间限制

- **缺点**：
  - 增加服务器计算开销

### 3. 缓存流程
1. 强缓存失效
2. 发送验证请求（携带 If-Modified-Since 或 If-None-Match）
3. 服务器检查资源状态
4. 返回 304 或新资源

## 三、缓存优先级

### 1. 优先级顺序
1. Cache-Control
2. Expires
3. If-None-Match
4. If-Modified-Since

### 2. 选择依据
- 强缓存优先于协商缓存
- 新版本优先于旧版本
- 精确匹配优先于时间匹配

## 四、最佳实践

### 1. 缓存策略
- **静态资源**：
  - 使用强缓存（Cache-Control: max-age）
  - 文件名添加版本号
  - 设置 immutable

- **动态资源**：
  - 使用协商缓存
  - 合理设置 ETag
  - 控制缓存时间

### 2. 注意事项
- 考虑浏览器兼容性
- 合理设置缓存时间
- 注意缓存更新机制

## 五、总结

### 1. 核心要点
- 强缓存减少请求
- 协商缓存保证更新
- 合理使用缓存策略

### 2. 优化建议
- 静态资源长期缓存
- 动态资源及时更新
- 监控缓存命中率

### 3. 发展趋势
- HTTP/2 优化
- 智能缓存策略
- 边缘计算应用