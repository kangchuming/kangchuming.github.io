# Webpack Loader 详解

## 一、基础概念

### 1. 什么是 Loader
- Webpack 原生只支持 JavaScript 和 JSON 文件
- Loader 用于处理其他类型的文件
- 将文件转换为 Webpack 可处理的模块

### 2. Loader 执行顺序
- 从右到左执行
- 从下到上执行
- 每个 Loader 处理后的结果传递给下一个 Loader

## 二、常用 Loader

### 1. 样式处理
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',    // 最后执行：注入样式
        'css-loader',      // 中间执行：解析 CSS
        'postcss-loader'   // 最先执行：处理 CSS
      ]
    }
  ]
}
```

#### 1.1 核心 Loader
- **css-loader**：解析 CSS 文件
  - 处理 @import 和 url()
  - 将 CSS 转换为 JS 模块
- **style-loader**：注入样式
  - 动态插入 `<style>` 标签
  - 支持热更新

#### 1.2 预处理器
- **sass-loader**：编译 SCSS/SASS
- **less-loader**：编译 Less
- **postcss-loader**：处理 CSS
  - 添加浏览器前缀
  - 压缩 CSS

### 2. JavaScript 处理
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    }
  ]
}
```

#### 2.1 核心 Loader
- **babel-loader**：ES6+ 转 ES5
  - 支持最新语法
  - 可配置缓存
- **swc-loader**：替代 babel-loader
  - 更快的编译速度
  - 更小的体积

### 3. 其他资源处理
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      type: 'asset/resource'  // Webpack 5 新特性
    }
  ]
}
```

#### 3.1 文件处理
- **file-loader**：处理文件
- **url-loader**：处理文件，可转 base64
- **html-loader**：处理 HTML 文件
- **csv-loader**：处理 CSV 文件
- **xml-loader**：处理 XML 文件

### 4. 框架支持
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    }
  ]
}
```

#### 4.1 框架 Loader
- **vue-loader**：处理 Vue 组件
- **ts-loader**：处理 TypeScript

## 三、性能优化

### 1. 多线程处理
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        'thread-loader',  // 开启多线程
        'babel-loader'
      ]
    }
  ]
}
```

### 2. 缓存配置
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true  // 启用缓存
        }
      }
    }
  ]
}
```

## 四、最佳实践

### 1. Loader 配置原则
- 明确指定文件类型
- 合理使用 exclude
- 按需配置 options

### 2. 性能优化建议
- 使用缓存
- 开启多线程
- 避免不必要的处理

### 3. 常见问题
- Loader 顺序错误
- 配置项遗漏
- 性能瓶颈