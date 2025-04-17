# Node.js Cluster 模块详解

## 一、基础概念

### 1. 单线程与多进程
- Node.js 事件循环是单线程的
- 高并发场景下可能成为瓶颈
- Cluster 模块实现多进程，充分利用多核 CPU

### 2. 核心组件
- **主进程（Master）**：管理进程生命周期
- **工作进程（Worker）**：独立 Node.js 实例
- **请求分发**：主进程分配请求给工作进程

## 二、基本实现

### 1. 核心代码
```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  // 主进程
  console.log(`Master ${process.pid} is running`);
  
  // 创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 进程退出处理
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // 工作进程
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Worker ${process.pid} handled the request\n`);
  }).listen(3000);
}
```

### 2. 执行流程
1. 引入必要模块
2. 获取 CPU 核心数
3. 判断进程类型
4. 主进程创建工作进程
5. 工作进程处理请求

## 三、性能对比

### 1. 单进程模式
```javascript
// server-single.js
const http = require('http');

function blockCPU() {
  const end = Date.now() + 5000;
  while (Date.now() < end) {}
}

http.createServer((req, res) => {
  if (req.url === '/block') {
    blockCPU();
    res.end('Blocked');
  } else {
    res.end(`Hello from ${process.pid}`);
  }
}).listen(3000);
```

### 2. 性能指标对比
| 模式 | 请求/秒 | CPU 利用率 | 错误率 |
|------|---------|------------|--------|
| 单进程 | 200 | 25% (单核) | 0% |
| 4核 Cluster | 850 | 100% (4核) | 0% |

## 四、高可用性

### 1. 进程管理
- 自动重启崩溃的工作进程
- 错误隔离：单个进程崩溃不影响整体
- 零停机重启支持

### 2. 会话共享
```javascript
// Redis 共享会话
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
```

## 五、性能优化

### 1. 进程数量
```javascript
// 根据环境设置进程数
const workers = process.env.NODE_ENV === 'production' 
  ? os.cpus().length 
  : 2;
```

### 2. 进程间通信
```javascript
// 主进程发送消息
worker.send({ type: 'task', data: { /* ... */ } });

// 工作进程接收消息
process.on('message', (msg) => {
  if (msg.type === 'task') {
    // 处理任务
  }
});
```

## 六、生产环境实践

### 1. 进程管理工具
```bash
# 使用 PM2 启动
pm2 start app.js -i max
```

### 2. 监控与日志
```javascript
// 健康检查
cluster.on('message', (worker, message) => {
  if (message.type === 'healthcheck') {
    console.log(`Worker ${worker.pid} 状态正常`);
  }
});
```

## 七、适用场景

### 1. 推荐使用
- Web 服务器（Express/Koa）
- 微服务架构中的单个服务
- 高并发应用

### 2. 不推荐使用
- 单用户桌面应用
- 纯 CPU 密集型任务（需结合 Worker Threads）

## 八、总结

### 1. 核心优势
- 横向扩展：利用多核 CPU
- 故障隔离：单个进程崩溃不影响整体
- 自动恢复：保持服务持续可用

### 2. 最佳实践
- 使用进程管理工具（如 PM2）
- 实现会话共享
- 配置健康监控
- 合理设置进程数量