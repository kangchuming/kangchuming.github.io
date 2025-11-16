# 💡 手动实现一个可复用的 React 表单组件

## 📋 功能说明

这个组件通过传入字段配置 `list` 与提交地址 `url`，
动态渲染表单，并在用户输入后收集数据、发送请求。

---

## 🧱 核心代码

```jsx
import { useState } from 'react'
import axios from 'axios'

function FormComponent(props) {
  const { url, list } = props

  // ✅ 惰性初始化：只在首次渲染时执行初始化逻辑
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(list.map(item => [item.name, item.val]))
  )

  const [message, setMessage] = useState('')

  // ✅ 表单提交函数
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post(url, formData)
      setMessage(res.data)
    } catch (err) {
      setMessage(err.response?.data?.message || err.message)
    }
  }

  // ✅ 表单输入更新
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ul>
          {list.map(item => (
            <li key={item.name}>
              <label>{item.name}</label>
              <input
                name={item.name}
                type="text"
                value={formData[item.name]}
                onChange={handleChange}
              />
            </li>
          ))}
        </ul>
        <button type="submit">上传</button>
      </form>
      {message}
    </div>
  )
}

export default FormComponent
```

---

## 🧩 Props 说明

| Prop   | 类型                                     | 说明                    |
| ------ | -------------------------------------- | --------------------- |
| `url`  | `string`                               | 提交的接口地址               |
| `list` | `Array<{ name: string, val: string }>` | 表单字段配置，用于生成 `<input>` |

---

## ⚙️ 工作原理

1. **初始化阶段**
   使用惰性初始化 `useState(() => ...)`，只在首次渲染时将 `list` 转为 `formData` 对象。

2. **输入更新**
   当用户在任意输入框中输入内容时，`handleChange` 使用函数式更新确保状态同步安全。

3. **提交表单**
   阻止默认提交行为，通过 `axios.post` 将 `formData` 发送到服务器。

4. **错误与结果处理**
   若请求成功，展示响应内容；若失败，展示错误信息。

---

## 🧠 知识要点总结

| 知识点       | 说明                                                  |
| --------- | --------------------------------------------------- |
| **惰性初始化** | `useState(() => init)` 只在初次渲染时执行初始化逻辑，避免重复计算。       |
| **函数式更新** | `setState(prev => newState)` 确保更新基于最新状态，防止并发问题。     |
| **受控组件**  | `value` 与 `onChange` 同时存在，使 `<input>` 的值受 React 控制。 |
| **错误处理**  | 使用可选链 `err.response?.data?.message` 提高健壮性。          |

---

## 🧪 示例用法

```jsx
<FormComponent
  url="https://api.example.com/submit"
  list={[
    { name: 'username', val: '' },
    { name: 'email', val: '' },
    { name: 'password', val: '' }
  ]}
/>
```

---
```