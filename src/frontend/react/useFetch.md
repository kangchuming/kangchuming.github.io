# useFetch 组件设计

## 组件设计

1. 包含 loading、data、error 处理的功能
2. 包含错误中断的功能
3. 包含监听参数，并进行更新的功能
4. 包含生命周期处理的功能

## 代码

```jsx
import { useEffect, useState } from 'react'

function useFetch(url, configs) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!url) return

    const controller = new AbortController()

    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(url, {
          ...configs,
          signal: controller.signal
        })
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [url])

  return { data, error, loading }
}

export default useFetch

function App() {
  const { data, error, loading } = useFetch('https://api.example.com/user', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误：{error.message}</p>

  return <div>{JSON.stringify(data)}</div>
}
```

## hook 设计理念（何为 Hook)

1. 包含有 useState 和 useEffect
2. 入参变化时，要监听到变化，实现状态的更新
3. 需要有生命周期的处理
4. 返回的是状态和方法

## 代码详解

1. useFetch 中包含数据、error 和 loading 的处理，因此需要三个 useState

```jsx
const [data, setData] = useState(null)
const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)
```

2. fetch 需要添加错误中断的逻辑

```jsx
useEffect(() => {
  const controller = new AbortController()

  return () => controller.abort()
}, [url])
```
- 如果controller写在外面，每次中断时的controller因为有刷新不是同一个，导致无法中断，所以需要写到useEffect内部

3. 定义fetchData时，用try,catch,finally来实现三个useState的状态处理
```jsx

    async function fetchData () {
      setLoading(true)
      try {
        const res = await fetch(url, {
          ...configs,
          signal: controller.signal
        })
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
```
- 需要添加signal: controller.signal，来实现错误中断
- res 得到的是fetch流对象，而不是确定的状态，此时还需要使用 const json = await res.json(),才能拿到具体的值

4. 将定义好的Hook放入到父组件中，根据返回的状态做对应的显示或者处理
```jsx 
function App () {
  const { data, error, loading } = useFetch('https://api.example.com/user', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误：{error.message}</p>

  return <div>{JSON.stringify(data)}</div>
}
```