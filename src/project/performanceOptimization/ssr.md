# React 服务器端渲染（SSR）

## 基本实现

在 React 中实现服务器端渲染（SSR）主要涉及以下步骤：

1. 在服务器端，使用 `ReactDOMServer.renderToString` 方法将 React 组件转换为字符串。

```javascript
import { renderToString } from 'react-dom/server'
import App from './App'

app.get('/', (req, res) => {
  const appHtml = renderToString(<App />)
  res.send(appHtml)
})
```
2. 将渲染后的字符串插入到 HTML 模板中，然后将整个 HTML 响应发送给客户端。

3. 在客户端，React 检测到已经有服务器渲染的 HTML，会直接使用这些 HTML，而不是重新生成。这个过程叫做 "hydration"，可以通过 ReactDOM.hydrate 方法实现。

```jsx
import { hydrate } from 'react-dom'
import App from './App'

hydrate(<App />, document.getElementById('root'))
```

4. 为了实现数据的同步，服务器端需要将数据序列化到 HTML 中，客户端再从 HTML 中读取数据。

## 生命周期处理
在服务器端渲染（SSR）中，React 组件的生命周期有一些特殊的处理方式。服务器端只会执行 constructor 和 render 方法，不会执行其他生命周期方法，如 componentDidMount、componentDidUpdate 和 componentWillUnmount 等。

## 路由处理
在服务器端，我们需要根据请求的 URL 来匹配对应的路由，然后渲染出对应的组件。React Router 提供了 StaticRouter 组件，可以在服务器端使用。

```jsx
import { StaticRouter } from 'react-router-dom'

app.get('*', (req, res) => {
  const context = {}
  const appHtml = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  )
  res.send(appHtml)
})
```

## 代码分割处理
在客户端，我们可以使用 React 的 React.lazy 和 Suspense 来实现代码分割。但在服务器端，由于没有动态导入的能力，所以需要一些特殊的处理。一种常见的做法是使用 Loadable Components 库。

```jsx
import loadable from '@loadable/component'
const OtherComponent = loadable(() => import('./OtherComponent'))

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  )
}
```

在服务器端，我们需要使用 @loadable/server 提供的 ChunkExtractor 来收集和加载需要的代码块。

```jsx
import { ChunkExtractor } from '@loadable/server'
const extractor = new ChunkExtractor({ statsFile })
const jsx = extractor.collectChunks(<App></App>)

const html = renderToString(jsx)
```
然后在 HTML 模板中，使用 extractor.getScriptTags 和 extractor.getLinkTags 来插入对应的 <script> 和 <link> 标签。

# React 服务器端渲染（SSR）处理异步数据

在 SSR（服务器端渲染）项目中，处理多个接口请求的资源和前后端分离的项目并无太大差异。你仍然可以将功能分解为多个子组件，并在主页中集合这些组件。每个组件可以负责拉取和处理自己需要的数据。

在 SSR 中，你可以在服务器端拉取数据，然后在渲染组件之前将数据传递给组件。这样，当 HTML 到达客户端时，它已经包含了预加载的数据，无需再发起额外的 API 请求。

以下是一个简单的示例，展示了如何在服务器端拉取数据并传递给组件：

```javascript
app.get('/', async (req, res) => {
  // 拉取数据
  const data = await fetchData()

  // 将数据传递给组件
  const appHtml = renderToString(<App data={data} />)

  // 将数据序列化到 HTML 中，以便客户端可以访问
  const html = `
    <html>
      <body>
        <div id="root">${appHtml}</div>
        <script>
          window.__PRELOADED_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')}
        </script>
      </body>
    </html>
  `

  res.send(html)
})
```

在这个示例中，fetchData 是一个异步函数，用于从 API 获取数据。然后，我们将数据作为 prop 传递给 App 组件，并将数据序列化到 HTML 中，以便客户端可以访问。

在客户端，你可以从 window.__PRELOADED_DATA__ 获取预加载的数据，然后传递给组件：

```jsx
const data = window.__PRELOADED_DATA__
hydrate(<App data={data} />, document.getElementById('root'))
```