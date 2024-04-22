# 实现服务器端渲染（SSR）

服务器端渲染（SSR）允许在服务器端执行页面的渲染逻辑，然后将渲染好的页面直接发送给客户端。这样做可以提高首屏加载速度并优化SEO。

## 服务端渲染的运行机制

#### 客户端渲染

客户端渲染模式下，服务端会把渲染需要的静态文件发送给客户端，客户端加载过来之后，自己在浏览器里跑一遍 JS，根据 JS 的运行结果，生成相应的 DOM。这种特性使得客户端渲染的源代码总是特别简洁
```html
<!doctype html>
<html>
  <head>
    <title>我是客户端渲染的页面</title>
  </head>
  <body>
    <div id='root'></div>
    <script src='index.js'></script>
  </body>
</html>
```
`页面上呈现的内容，你在 html 源文件里里找不到`——这正是它的特点。

#### 服务端渲染

服务端渲染的模式下，当用户第一次请求页面时，由服务器把需要的组件或页面渲染成 HTML 字符串，然后把它返回给客户端。客户端拿到手的，是可以直接渲染然后呈现给用户的 HTML 内容，不需要为了生成 DOM 内容自己再去跑一遍 JS 代码。

使用服务端渲染的网站，可以说是“所见即所得”，页面上呈现的内容，我们在 html 源文件里也能找到。

#### 服务端渲染解决了什么性能问题

服务端渲染（SSR）主要解决了两个问题：

1. **搜索引擎优化（SEO）**：在客户端渲染模式下，搜索引擎无法获取由JavaScript动态生成的内容。而在服务端渲染模式下，服务器返回的HTML包含了所有预渲染的页面内容，使得搜索引擎能够索引到更多的关键字，提高了网站的可见性。

2. **首屏加载速度**：在客户端渲染模式下，用户需要等待JavaScript代码加载、解析并执行后，才能看到完整的页面内容。这可能导致首屏加载速度过慢，影响用户体验。而服务端渲染直接返回了可以呈现的HTML，大大提高了首屏加载速度，提升了用户体验。

#### 服务端渲染的应用实例

##### 源码结构
- index.html
- server.js # main application server
- src/
  - main.js          # 导出环境无关的（通用的）应用代码
  - entry-client.js  # 将应用挂载到一个 DOM 元素上
  - entry-server.js  # 使用某框架的 SSR API 渲染该应用

`index.html` 将需要引用 `entry-client.js` 并包含一个占位标记供给服务端渲染时注入： 

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

##### server.js

```javascript
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // 以中间件模式创建 Vite 应用，并将 appType 配置为 'custom'
  // 这将禁用 Vite 自身的 HTML 服务逻辑
  // 并让上级服务器接管控制
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的 Connect 实例作为中间件
  // 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
  // 当服务器重启（例如用户修改了 vite.config.js 后），
  // `vite.middlewares` 仍将保持相同的引用
  // （带有 Vite 和插件注入的新的内部中间件堆栈）。
  // 即使在重新启动后，以下内容仍然有效。
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
  
    try {
      // 1. 读取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )
  
      // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
      //    同时也会从 Vite 插件应用 HTML 转换。
      //    例如：@vitejs/plugin-react 中的 global preambles
      template = await vite.transformIndexHtml(url, template)
  
      // 3a. 加载服务器入口。vite.ssrLoadModule 将自动转换
      //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
      //    并提供类似 HMR 的根据情况随时失效。
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')
      // 3b. 从 Vite 5.1 版本开始，你可以试用实验性的 createViteRuntime
      // API。
      // 这个 API 完全支持热更新（HMR），其工作原理与 ssrLoadModule 相似
      // 如果你想尝试更高级的用法，可以考虑在另一个线程，甚至是在另一台机器上，
      // 使用 ViteRuntime 类来创建运行环境。
      const runtime = await vite.createViteRuntime(server)
      const { render } = await runtime.executeEntrypoint('/src/entry-server.js')
  
      // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
      //    函数调用了适当的 SSR 框架 API。
      //    例如 ReactDOMServer.renderToString()
      const appHtml = await render(url)
  
      // 5. 注入渲染后的应用程序 HTML 到模板中。
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
  
      // 6. 返回渲染后的 HTML。
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
      // 你的实际源码中。
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(5174)
}

createServer()
```

##### entry-server.js

```jsx
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  return { html }
}
```

##### App.jsx

```
import { Suspense, lazy } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

// Works also with SSR as expected
const Card = lazy(() => import('./Card'))

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <Suspense fallback={<p>Loading card component...</p>}>
        <Card />
      </Suspense>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

##### 外层server.js

```javascript
import fs from 'node:fs/promises'
import express from 'express'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5174
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
```

##### package.json

```json
{
  "name": "vite-react-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --ssrManifest --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.jsx --outDir dist/server",
    "preview": "cross-env NODE_ENV=production node server"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "express": "^4.19.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sirv": "^2.0.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.25",
    "@vitejs/plugin-react": "^4.2.1",
    "cross-env": "^7.0.3",
    "vite": "^5.2.10"
  }
}
```

##### 原版
```jsx
import express from 'express';
import {createServer as createViteServer} from 'vite';

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom' 
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    res.send(`
    <html>
      <head>
        <title>My Page</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
      </body>
    </html>
  `);
  });

  app.listen(4000, () => {
    console.log('Server started at http://localhost:4000');
  });
}

createServer();
```
服务端渲染（SSR）的核心在于两个步骤：

1. **使用`renderToString()`方法**：这个方法将虚拟DOM转化为字符串形式的真实DOM。在现代前端框架（如Vue、React等）中，这是一个关键的步骤，因为它们都使用虚拟DOM来提高渲染效率。

2. **将渲染结果插入到模板中**：这个步骤将渲染后的字符串形式的真实DOM插入到HTML模板中，生成可以直接发送给客户端的完整HTML页面。

因此，服务端渲染并不仅仅是在服务器上运行JavaScript代码，更准确地说，它是在服务器上运行前端框架的代码，生成预渲染的HTML页面，以提高首屏加载速度和SEO效果。

#### 服务端渲染的应用场景

虽然服务端渲染（SSR）可以提高首屏加载速度和SEO效果，但它并非万能的解决方案。以下是一些需要考虑的因素：

1. **服务器压力**：服务端渲染将本应由浏览器完成的渲染工作转移到了服务器。在用户数量众多的情况下，这可能会给服务器带来巨大的压力。

2. **资源分配**：服务器资源相对于用户的浏览器来说是稀缺的。因此，我们需要谨慎地考虑如何分配这些宝贵的资源。

在实践中，我们应该优先考虑其他的性能优化和SEO策略，只有在这些策略都无法满足需求时，才考虑使用服务端渲染。这可能需要向管理层申请更多的服务器资源，因此在决定使用服务端渲染之前，我们需要进行充分的考虑和评估。
