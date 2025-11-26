# ✅ GET 和 POST 的参数选择

## 一、GET 参数用法

### 1. 在 URL 中传参

示例：

```
www.baidu.com/?code={code}&type={type}
```

### 2. 使用 axios 的写法

```js
axios.get(url, {
  params: {
    code: code,
    type: type,
  }
})
```

📌 **注意：是 `params`（不是 paramas）**
axios 会自动把 `params` 拼到 URL 上。

---

## 二、POST 参数用法

### 1. 请求体（Body）传参

```js
axios.post(url, {
  code: code,
  type: type
})
```

参数不会出现在 URL 中，而是放入 HTTP Body。

---

## 三、GET 与 POST 的区别

1. **参数位置不同**

   * GET：放在 URL (Query Parameters)
   * POST：放在 Body (Request Payload)

2. **安全性不同**

   * GET 暴露在 URL → 浏览器历史、服务器日志都会记录
   * POST 不在 URL → 更适合登录、鉴权等敏感数据

3. **用途不同（推荐）**

   * GET：查询、不修改服务器状态
   * POST：创建或提交数据（登录、表单）

4. **数据大小限制不同（补充）**

   * GET URL 长度有限制（各浏览器不同，但总体偏小）
   * POST 基本无限制（适合提交大数据）

5. **浏览器缓存行为不同（补充）**

   * GET 可能被浏览器缓存
   * POST 默认不会缓存

---

# ✔ 最终总结（简短版本，文档里很好用）

* **GET 参数 → 放在 URL → axios 用 `params` → 不适合敏感信息**
* **POST 参数 → 放在 Body → axios 直接传对象 → 常用在登录和提交数据**
