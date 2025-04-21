# Redis 热点问题解决方案

## 一、缓存击穿（Hotspot Key Breakdown）

### 1. 问题定义
- **概念**：热点 Key 突然失效，大量并发请求直接穿透到数据库
- **场景**：明星绯闻、秒杀商品等突发性高并发访问
- **影响**：数据库压力激增，可能导致服务崩溃

### 2. 解决方案

#### 2.1 互斥锁（分布式锁）
```java
RLock lock = redissonClient.getLock("LOCK_PREFIX:" + key);  
try {  
    if (lock.tryLock(5, 10, TimeUnit.SECONDS)) { // 等待5秒，锁10秒自动释放  
        value = db.query(key);  
        redis.set(key, value, 300);  
    }  
} finally {  
    lock.unlock();  
}
```

- **实现要点**：
  - 使用 Redis SETNX 实现分布式锁
  - 设置合理的锁超时时间
  - 确保锁的释放

- **优化方案**：
  - 异步刷新：后台线程提前续期热点 Key
  - 锁粒度控制：避免锁范围过大

#### 2.2 空值缓存
- **实现方式**：
  - 缓存 NULL 值
  - 设置较短 TTL（如 2 分钟）
- **注意事项**：
  - 业务层需兼容空值处理
  - 设置合理的过期时间

## 二、缓存雪崩（Cache Avalanche）

### 1. 问题定义
- **概念**：大量 Key 同时过期或 Redis 集群宕机
- **场景**：电商大促、批量缓存过期
- **影响**：请求全部涌向数据库，引发连锁故障

### 2. 解决方案

#### 2.1 TTL 随机化
```python
import random  
ttl = 3600 + random.randint(-300, 300)  
redis.set(key, value, ex=ttl)
```

- **实现要点**：
  - 基础 TTL 添加随机值
  - 控制随机范围（如 ±5 分钟）

#### 2.2 熔断降级
```yaml
rules:  
  - resource: queryDB  
    grade: 1           # 异常比例模式  
    count: 500         # QPS阈值  
    timeWindow: 10     # 熔断时间10秒  
    minRequestAmount: 5  
    statIntervalMs: 1000
```

- **实现要点**：
  - 设置合理的 QPS 阈值
  - 配置兜底数据
  - 监控熔断状态

#### 2.3 多级缓存架构
```java
Caffeine.newBuilder()  
        .expireAfterWrite(10, TimeUnit.SECONDS)  // 本地缓存10秒  
        .maximumSize(1000);
```

- **架构设计**：
  - 本地缓存（Caffeine）
  - Redis 集群
  - 数据库

#### 2.4 Redis 高可用
- **实现方案**：
  - Cluster 模式
  - Sentinel 模式
  - 持久化（AOF + RDB）

## 三、缓存穿透（Cache Penetration）

### 1. 问题定义
- **概念**：大量请求查询不存在的数据
- **场景**：恶意攻击、爬虫爬取
- **影响**：绕过缓存直接访问数据库

### 2. 解决方案

#### 2.1 布隆过滤器
```java
RBloomFilter<String> bloomFilter = redisson.getBloomFilter("userFilter");  
bloomFilter.tryInit(1000000L, 0.01);  // 100万数据，1%误判率  
bloomFilter.add("validKey1");  

if (!bloomFilter.contains(key)) {  
    return null;  // 直接拦截  
}
```

- **实现要点**：
  - 合理设置误判率
  - 定期更新过滤器
  - 数据同步机制

#### 2.2 空值缓存 + 参数校验
```java
if (id <= 0) {  // 校验非法ID  
    throw new IllegalArgumentException("Invalid ID");  
}
```

- **实现要点**：
  - 严格的参数校验
  - 合理的空值 TTL
  - 错误信息处理

#### 2.3 限流与黑名单
- **实现方案**：
  - IP 限流
  - 黑名单机制
  - 动态调整策略

## 四、高级优化方案

### 1. 缓存一致性
- **延迟双删**：
  - 更新数据库后删除缓存
  - 延迟 500ms 再次删除
- **Binlog 监听**：
  - 通过 Canal 监听变更
  - 异步更新缓存

### 2. 分布式环境处理
- **一致性哈希**：
  - 均匀分布请求
  - 减少数据迁移
- **广播通知**：
  - Redis Pub/Sub
  - 本地缓存同步

### 3. 监控与调优
- **监控指标**：
  - 缓存命中率
  - 响应时间
  - 错误率
- **动态调优**：
  - 自动延长热点 Key TTL
  - 动态调整限流阈值

## 五、最佳实践

### 1. 方案选择
- 根据业务场景选择合适方案
- 考虑系统复杂度
- 评估维护成本

### 2. 性能优化
- 合理设置超时时间
- 控制锁粒度
- 优化数据结构

### 3. 运维建议
- 定期监控系统状态
- 及时处理告警
- 定期优化配置

## 六、总结

### 1. 核心方案
- 缓存击穿：分布式锁 + 空值缓存
- 缓存雪崩：TTL 随机化 + 熔断 + 多级缓存
- 缓存穿透：布隆过滤器 + 参数校验

### 2. 注意事项
- 合理设置超时时间
- 注意数据一致性
- 做好监控告警

### 3. 扩展建议
- 持续优化系统性能
- 关注新技术发展
- 积累实战经验