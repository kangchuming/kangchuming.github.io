# Ant Design Upload 组件的 customRequest 使用总结

## 1. 基本介绍

`customRequest` 是 Ant Design Upload 组件的一个重要属性，用于自定义上传行为。当默认的上传行为不满足需求时（如需要上传到特定服务器或使用特定的上传协议），我们可以通过它来实现完全自定义的上传逻辑。

## 2. 参数解构

customRequest 接收一个对象参数，包含以下关键属性：
```typescript
interface CustomRequestOptions {
  file: File;           // 要上传的文件对象
  onSuccess: (response: any) => void;  // 上传成功的回调
  onError: (error: Error) => void;     // 上传失败的回调
  onProgress: (event: { percent: number }) => void;  // 上传进度回调
}
```

## 3. 实际使用示例

### 3.1 基本配置
```typescript
const props: UploadProps = {
  name: 'file',
  customRequest: ({ file, onSuccess, onError, onProgress }) => {
    // 自定义上传逻辑
  },
  // 其他配置...
}
```

### 3.2 完整实现示例
```typescript
customRequest: ({ file, onSuccess, onError, onProgress }) => {
  useUploadFilesToNOS({
    uploadFile: file as UploadFile,
    getUploadTokenPromise: (exFile: any) => getUploadTokenPromise(exFile),
    onSuccess: (response: any) => {
      // 1. 处理业务逻辑
      const imageUrl = `https://${response.bucketName}.nosdn.127.net/${response.objectKey}`;
      
      // 2. 更新组件状态
      updateImageList(imageUrl);
      
      // 3. 通知Upload组件上传完成
      onSuccess?.(response);
      
      // 4. 执行后续操作
      handleUploadComplete(imageUrl);
    },
    onProgress: (event: { percent: number }) => {
      // 更新上传进度
      updateLoadingState(true);
      onProgress?.(event);
    },
    onError: (error: Error) => {
      // 处理错误情况
      updateLoadingState(false);
      onError?.(error);
    }
  });
}
```

## 4. 最佳实践

### 4.1 状态管理
- 使用 `useRef` 存储上传相关状态，避免闭包问题
```typescript
const allDataRef = useRef({
  imgInfoList: [],
  inputRef: null,
});
```

### 4.2 进度处理
- 实时更新上传进度
- 维护正确的 loading 状态
```typescript
onProgress: (event: { percent: number }) => {
  if (!isLoading) {
    updateLoadingState(true);
  }
  onProgress?.(event);
}
```

### 4.3 错误处理
- 完善的错误捕获机制
- 用户友好的错误提示
```typescript
onError: (error: Error) => {
  updateLoadingState(false);
  message.error('上传失败');
  onError?.(error);
}
```

## 5. 注意事项

### 5.1 回调顺序
1. 先处理业务逻辑（如更新本地数据）
2. 调用 Upload 组件的回调（onSuccess/onError/onProgress）
3. 执行后续操作（如跳转、刷新等）

### 5.2 状态管理
- 推荐使用 `useRef` 而非 `useState` 存储上传状态
- 避免在回调中直接使用 state，防止闭包问题

### 5.3 内存管理
- 及时清理临时状态和引用
- 注意大文件上传时的内存占用

## 6. 扩展功能

### 6.1 文件验证
```typescript
beforeUpload: (file: UploadFile) => {
  // 文件大小验证
  const isSize = file.size / 1024 / 1024;
  if (isSize > 50) {
    message.error('文件大小不能超过50MB');
    return Upload.LIST_IGNORE;
  }

  // 文件类型验证
  const isAccept = file.type === 'application/pdf' || 
                   file.type === 'image/jpeg' || 
                   file.type === 'image/png';
  if (!isAccept) {
    message.error('文件格式不支持');
    return Upload.LIST_IGNORE;
  }

  return true;
}
```

### 6.2 上传凭证获取
```typescript
const getUploadTokenPromise = (file: any) => {
  const { name, size, lastModified } = file;
  return $getEduToken(name, size, lastModified, EResourceTokenType.Image);
};
```

## 总结

通过合理使用 `customRequest`，我们可以实现完全自定义的上传逻辑，同时保持与 Ant Design Upload 组件的良好集成。关键是要注意状态管理、错误处理和内存管理，确保上传流程的稳定性和可靠性。