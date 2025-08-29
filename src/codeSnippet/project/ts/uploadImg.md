### 前端图片上传工具函数总结（基于 fetch + 表单校验）

本文总结一段图片上传的封装代码，包含组件侧调用与工具函数实现，重点在格式/大小校验与错误处理，便于在项目中直接复用。

## 使用场景与调用方式
在组件中通过回调触发上传，并捕获错误防止 Unhandled Rejection：
```ts
// MarkdownEditor 组件中
const handleImageUploadFn = useCallback(async (file: File) => {
  try {
    return await handleImageUpload(file, {
      maxSize: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    });
  } catch (error) {
    console.error('图片上传失败:', error);
  }
}, []);
```

## 工具函数签名
```ts
interface UploadOptions {
  maxSize?: number;            // MB，默认 5
  allowedTypes?: string[];     // 允许的 MIME 类型
}

// 上传图片到 NOS，返回图片 URL
const handleImageUpload = async (file: File, options?: UploadOptions): Promise<string> => { ... }
export default handleImageUpload;
```

## 参数校验
- 类型校验：不在 `allowedTypes` 列表 → 弹出错误并 `reject`
- 大小校验：超过 `maxSize`（MB）→ 弹出错误并 `reject`
```ts
if (!allowedTypes.includes(file.type)) { message.error('格式出错'); return Promise.reject(new Error('格式出错')); }
if (file.size / 1024 / 1024 > maxSize) { message.error(`图片大小超过${maxSize}MB`); return Promise.reject(new Error(...)); }
```

## 上传实现
- 使用 `FormData` 携带文件字段 `file`
- `fetch` 提交到上传服务，携带 `credentials: 'include'`（同域 Cookie）
```ts
const formData = new FormData();
formData.append('file', file);

const res = await fetch('//apollo-admin.study.youdao.com/image-service/file/small/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include',
});
```

## 响应处理
- `!res.ok`：根据状态码提示错误并 `reject`
- 返回体为文本：若是以 `http://` 或 `https://` 开头的 URL，则直接返回；否则提示“网络错误”
```ts
if (!res.ok) { message.error(`上传失败: ${res.status} ${res.statusText}`); return Promise.reject(new Error(...)); }

const responseText = await res.text();
if (responseText && (responseText.startsWith('http://') || responseText.startsWith('https://'))) {
  return responseText; // 成功返回图片 URL
}
message.error('网络错误');
return Promise.reject(new Error('网络错误'));
```

## 错误兜底
- 捕获异常，统一提示并向上抛出可诊断的 `Error`
```ts
} catch (err) {
  const errorMsg = err instanceof Error ? err.message : '图片上传失败';
  message.error(errorMsg);
  return Promise.reject(new Error(errorMsg));
}
```

## 特性与优点
- 输入即校验：类型、大小的前置拦截，避免无效网络请求
- 结果明确：成功返回 URL 字符串；失败统一 `reject`，便于组件侧处理
- 用户友好：用 `antd` 的 `message` 及时反馈错误
- 易扩展：通过 `UploadOptions` 可调整大小与类型限制

## 建议与注意
- 按后端接口规范调整字段名与返回格式（如非纯文本 URL，需改解析逻辑）
- 跨域与 Cookie：若依赖登录态，确保 `credentials` 与服务端 CORS 配置一致
- UI 交互：结合 loading、禁用按钮、重试机制提升体验
- 安全性：可在前端增加分辨率校验、HEIC 转换、压缩等预处理步骤

这段封装适用于大多数“表单直传图片 → 返回 URL”的场景，结构清晰、可直接落地使用。