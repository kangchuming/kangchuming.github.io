# 性能优化

## webpack性能调优
HTTP优化有两个方向：
- 减少请求次数
- 减少单次请求所花费的时间
这两个优化点直直地指向了我们日常开发中非常常见的操作——资源的压缩与合并

### webpack 优化方案
1. 构建过程提速
  使用include 或 exclude 来帮避免不必要的转译
  ```javascript
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```
这段代码帮我们规避了对庞大的 node_modules 文件夹或者 bower_components 文件夹的处理