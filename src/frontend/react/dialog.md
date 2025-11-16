# Dialog 组件设计

## 设计思路

1.  需要实现的功能
    a. 内置一个 Form 实现数据的展示、修改、提交
    b. 外部父组件通过 ref 进行控制 Dialog 的显隐
2.  功能拆分
    a. Form - Dialog 内通过循环去遍历数据 - 使用 useState 去修改 input 的值，并更新 - 通过 button 提供 Dialog 的显隐和提交
    b. 父组件 Ref 通过 forwardRef 传入到子组件中 - 子组件通过 ref 完成绑定，可以将子组件的方法拿到父组件使用 - 数据更新填入时更新数据

## 代码实现

```jsx
import s from 'index.css'

const Dialog = forwardRef((props, ref) => {
  const { data } = props
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState(data)

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false)
  }))

  return (
    visible && (
      <dialog open>
        <form method='dialog'>
          {formData.map((item, i) => (
            <div key={i} className={s.inputContainer}>
              <label>{item.title}</label>
              <input
                value={item.value}
                onChange={e => {
                  let newData = [...formData]
                  newData[i].value = e.target.value
                  setFormData(newData)
                }}
              />
            </div>
          ))}
          <div className={s.btns}>
            <button type='button' onClick={() => setVisible(false)}>
              取消
            </button>
            <button type='button' onClick={() => setVisible(false)}>
              提交
            </button>
          </div>
        </form>
      </dialog>
    )
  )
})

export default Dialog

// Parent
import Dialog from 'Dialog'
import { useState } from 'react'

function Parent() {
  const ref = useRef(null)
  const data = [
    { title: '静心', value: 'patience' },
    { title: '基础', value: 'ability' }
  ]

  return (
    <>
      <button onClick={() => ref.current.show()}>显示Dialog</button>
      <Dialog data={data} ref={ref}></Dialog>
    </>
  )
}
```

## 代码总结

1. 用 forwardRef 包裹整个子组件，才能实现将父组件的 ref 传递到子组件，因为正常的 ref 无法通过 DOM 绑定

```jsx
const  Dialog = forwardRef((props, ref) => {
```

2. 通过 useImperativeHandle 来实现子组件中的方法的实现，将 ref 传递进去

```jsx
useImperativeHandle(ref, () => ({
  show: () => setVisible(true),
  hide: () => setVisible(false)
}))
```

3. return () 返回的是 jsx, 而无法返回对象，此种情况会出错

```jsx
// 错误
return (
  {visible && (...) }
)
```

```jsx
// 正确
return (
  visible && (...)
)
```

4. 数据的更新

```jsx

/// 数据传入
const  Dialog = forwardRef((props, ref) => {
  const { data } = props;
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(data);  //将数据放入

 // 数据更改
  {formData.map((item, i) => (
                <div key = {i} className={s.inputContainer}>
                    <label>{item.title}</label>
                    <input value={item.value} onChange={(e) => {
                        let newData = [...formData];
                        newData[i].value = e.target.value;
                        setFormData(newData);
                    }} />
                </div>
            ))}
```

5. 父组件的ref生成和传递
```jsx
function Parent() {
  const ref = useRef(null)

   return (
    
        <>
            <button onClick={() => ref.current.show()}>显示Dialog</button>
            <Dialog data={data} ref={ref}></Dialog>
        </>
        
    )
```
