# 网络性能优化

我们从输入 URL 到显示页面这个过程中，涉及到网络层面的，有三个主要过程：

1. DNS 解析
2. TCP 连接
3. HTTP 请求/响应

对于 DNS 解析和 TCP 连接两个步骤，我们前端可以做的努力非常有限。相比之下，HTTP 连接这一层面的优化才是我们网络优化的核心。

## HTTP 优化

HTTP 优化有两个大的方向：

1. 减少请求次数
2. 减少单次请求所花费的时间

这两个优化点直直地指向了我们日常开发中非常常见的操作——资源的压缩与合并。没错，这就是我们每天用构建工具在做的事情。而时下最主流的构建工具无疑是 webpack，所以我们这节的主要任务就是围绕业界霸主 webpack 来做文章。

### webpack 的性能瓶颈

webpack 的优化瓶颈，主要是两个方面：

1. webpack 的构建过程太花时间
2. webpack 打包的结果体积太大

### webpack 优化方案

#### 构建过程提速策略

##### 不要让 loader 做太多事情——以 babel-loader 为例

babel-loader 无疑是强大的，但它也是慢的。最常见的优化方式是，用 include 或 exclude 来帮我们避免不必要的转译。

```typescript
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
这段代码帮我们规避了对庞大的 node_modules 文件夹或者 bower_components 文件夹的处理。但通过限定文件范围带来的性能提升是有限的。除此之外，如果我们选择开启缓存将转译结果缓存至文件系统，则至少可以将 babel-loader 的工作效率提升两倍。要做到这点，我们只需要为 loader 增加相应的参数设定：

```typescript
loader: 'babel-loader?cacheDirectory=true'
```

#### 不要放过第三方库

第三方库以 node_modules 为代表，它们庞大得可怕，却又不可或缺。处理第三方库的姿势有很多，其中，CommonsChunkPlugin 每次构建时都会重新构建一次 vendor；出于对效率的考虑，我们更多是使用 DllPlugin。

DllPlugin 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。

用 DllPlugin 处理文件，要分两步走：

1. 基于 dll 专属的配置文件，打包 dll 库
2. 基于 webpack.config.js 文件，打包业务代码
以一个基于 React 的简单项目为例，我们的 dll 的配置文件可以编写如下：

```jsx
const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
      // 依赖的库数组
      vendor: [
        'prop-types',
        'babel-polyfill',
        'react',
        'react-dom',
        'react-router-dom',
      ]
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      library: '[name]_[hash]',
    },
    plugins: [
      new webpack.DllPlugin({
        // DllPlugin的name属性需要和libary保持一致
        name: '[name]_[hash]',
        path: path.join(__dirname, 'dist', '[name]-manifest.json'),
        // context需要和webpack.config.js保持一致
        context: __dirname,
      }),
    ],
}
```
随后，我们只需在 webpack.config.js 里针对 dll 稍作配置：

```jsx
const path = require('path');
const webpack = require('webpack')
module.exports = {
  mode: 'production',
  // 编译入口
  entry: {
    main: './src/index.js'
  },
  // 目标文件
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js'
  },
  // dll相关配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest就是我们第一步中打包出来的json文件
      manifest: require('./dist/vendor-manifest.json'),
    })
  ]
}
```

一次基于 dll 的 webpack 构建过程优化，便大功告成了！

#### Happypack-将loader由单进程转为多进程
  webpack是单线程的，由happypack释放cpu在多核并发的优势
  ```jsx
  const HappyPack = require('happypack')
// 手动创建进程池
const happyThreadPool =  HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  module: {
    rules: [
      ...
      {
        test: /\.js$/,
        // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
        loader: 'happypack/loader?id=happyBabel',
        ...
      },
    ],
  },
  plugins: [
    ...
    new HappyPack({
      // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
      id: 'happyBabel',
      // 指定进程池
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory']
    })
  ],
}
```

#### 构建结果体积压缩
文件结构可视化，找出导致体积过大的原因
webpack-bundle-analyzer，配置方法和普通的 plugin 无异，它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来。
在使用时，我们只需要将其以插件的形式引入：
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

#### 删除冗余代码
1. 一个比较典型的应用，就是 Tree-Shaking。
2. 对碎片化冗余点的删除：至于粒度更细的冗余代码的去除，往往会被整合进 JS 或 CSS 的压缩或分离过程中。

这里我们以当下接受度较高的 UglifyJsPlugin 为例，看一下如何在压缩过程中对碎片化的冗余代码（如 console 语句、注释等）进行自动化删除：

```javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
 plugins: [
   new UglifyJsPlugin({
     // 允许并发
     parallel: true,
     // 开启缓存
     cache: true,
     compress: {
       // 删除所有的console语句    
       drop_console: true,
       // 把使用多次的静态值自动定义为变量
       reduce_vars: true,
     },
     output: {
       // 不保留注释
       comment: false,
       // 使输出的代码尽可能紧凑
       beautify: false
     }
   })
 ]
}
```

#### 按需加载
首先 webpack 的配置文件要走起来：

```javacript
output: {
    path: path.join(__dirname, '/../dist'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath,
    // 指定 chunkFilename
    chunkFilename: '[name].[chunkhash:5].chunk.js',
},
```
路由处的代码也要做一下配合：

```javacript
const getComponent => (location, cb) {
  require.ensure([], (require) => {
    cb(null, require('../pages/BugComponent').default)
  }, 'bug')
},
...
<Route path="/bug" getComponent={getComponent}>
```
对，核心就是这个方法：

```javascript
require.ensure(dependencies, callback, chunkName)
```

这是一个异步的方法，webpack 在打包时，BugComponent 会被单独打成一个文件，只有在我们跳转 bug 这个路由的时候，这个异步方法的回调才会生效，才会真正地去获取 BugComponent 的内容。这就是按需加载。

#### Gzip
具体的做法非常简单，只需要你在你的 request headers 中加上这么一句：

```jsx
accept-encoding:gzip
```
Gzip 是万能的吗
首先要承认 Gzip 是高效的，压缩后通常能帮我们减少响应 70% 左右的大小。

但它并非万能。Gzip 并不保证针对每一个文件的压缩都会使其变小。

Gzip 压缩背后的原理，是在一个文本文件中找出一些重复出现的字符串、临时替换它们，从而使整个文件变小。根据这个原理，文件中代码的重复率越高，那么压缩的效率就越高，使用 Gzip 的收益也就越大。反之亦然





