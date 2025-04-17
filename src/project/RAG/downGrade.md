# 动态熔断与降级实现方案

## 一、动态熔断机制

### 1. 目标
当星火API的错误率超过阈值（5%）时，自动切断请求，避免雪崩效应。

### 2. 实现细节

#### 错误率计算
- **滑动时间窗口**：使用Redis Sorted Set记录最近5分钟的请求结果
- **统计逻辑**：
  - 每10秒统计窗口内总请求数和失败数
  - 错误率 = 失败请求数 / 总请求数 * 100%

#### 熔断触发条件
- 错误率 > 5% 且 总请求数 > 100（避免低流量误判）
- 在Redis中设置熔断状态和过期时间：
```bash
SET circuit_breaker:status "OPEN" EX 30  # 熔断30秒
```

#### 熔断恢复机制
- **半开状态**：熔断30秒后进入半开状态，允许10%流量通过
- **试探机制**：
  - 试探请求成功率 > 90%：关闭熔断
  - 试探失败：重新触发熔断，延长熔断时间（指数退避）

## 二、降级策略

### 1. 静态降级
- **适用场景**：非核心功能或服务完全不可用
- **实现方式**：
```javascript
const staticFallback = {
  text: "当前服务繁忙，请稍后再试。",
  code: 503,
  cacheKey: null
};
```

### 2. 动态降级

#### 缓存写入
```javascript
async function saveToCache(query, response) {
  const vector = await text2vec.encode(query);
  const cacheKey = `cache:${md5(query)}`;
  
  await redis.set(cacheKey, JSON.stringify({
    response, 
    vector, 
    expire: Date.now() + 3600_000
  }));
  
  await milvus.insert({
    collection: "response_cache",
    data: [{
      id: cacheKey, 
      vector: vector 
    }]
  });
}
```

#### 缓存检索
```javascript
async function searchCache(query) {
  const queryVector = await text2vec.encode(query);
  const results = await milvus.search({
    collection: "response_cache",
    vector: queryVector,
    limit: 1,
    params: { metric_type: "L2", threshold: 0.1 }
  });

  if (results.length > 0) {
    const cacheKey = results[0].id;
    const cachedData = await redis.get(cacheKey);
    return JSON.parse(cachedData).response;
  }
  return null;
}
```

### 3. 备用服务切换

#### Nginx配置
```nginx
location /api/ask {
  proxy_pass http://spark-api-backend;
  error_page 502 503 = @fallback;
}

location @fallback {
  proxy_pass http://backup-model-backend;
}
```

#### 流式响应处理
```javascript
app.post("/ask", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  const responseStream = await degrade(req.body);
  
  for (const chunk of responseStream) {
    res.write(`data: ${chunk}\n\n`);
  }
  res.end();
});
```

## 三、技术架构

### 1. 熔断器状态机
```javascript
class CircuitBreaker {
  constructor() {
    this.status = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.totalCount = 0;
  }

  async callAPI(request) {
    if (this.status === 'OPEN') {
      return this.degrade();
    }

    try {
      const response = await sparkAPI(request);
      this.recordSuccess();
      return response;
    } catch (error) {
      this.recordFailure();
      if (this.calculateErrorRate() > 5%) {
        this.tripCircuit();
      }
      throw error;
    }
  }
}
```

### 2. 监控与告警
- **监控指标**：
  - 熔断状态
  - 错误率
  - 降级比例
  - 缓存命中率
- **告警阈值**：
  - 降级率 > 20%
  - 备用服务负载 > 70%

## 四、实施效果

### 1. 性能提升
- 异常请求下降35%
- 月度API成本降低18%
- 60FPS虚拟滚动和流式渲染保持流畅

### 2. 系统稳定性
- 通过熔断避免连锁故障
- 降级策略保障核心功能可用性
- 监控系统实时反馈系统状态

## 五、总结

系统通过动态熔断和降级机制，实现了：
1. 自动化的故障隔离
2. 智能的降级策略
3. 高效的缓存复用
4. 流畅的用户体验

最终实现了异常请求下降35%，成本节约18%的显著效果。