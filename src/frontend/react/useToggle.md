# useToggle

## 组件功能设计
1. 提供状态的修改
2. 输入一个初始状态
3. 返回修改后的状态和修改方法

## 代码
```jsx
import { useState } from 'react'

function useToggle (initialStatus = false) {
  const [status, setStatus] = useState(initialStatus)

  const changeStatus = () => {
    setStatus(prev => !prev)
  }

  return [status, changeStatus]
}

export default useToggle

import { useState } from 'react'
import useToggle from './useToggle.js'

function Father () {
  const [isOpen, toggleOpen] = useToggle(false)

  return (
    <div>
      <p>{isOpen}</p>
      <button onClick={() => toggleOpen()}>修改状态</button>
    </div>
  )
}
```

## 代码总结
1. 自定义Hook不必使用useEffect,根据场景来定义
2. 自定义hook可以仅作为状态的封装和修改，不必有UI
3. 根据当前的状态的修改
```jsx
setStatus(prev => !prev)
```
和普通的setStatus(!prev)相比，每次会拿到当前的最新值来进行处理，而普通的setStatus可能会拿到历史值，导致更新状态有误
4. 自定义hooks返回[]或者{}, 父组件使用相对应的进行解析，同时解析时[]可以使用别的参数名，{}需要写为{status: isOpen}