## svg无法点击
* svg添加了点击事件，没有点击效果 *

```tsx
<ReactSVG
    src={ articleData?.wxArticleLink !== null ? iconRefreshData : errLoginFlag}
    wrapper="span"
    className='refreshData'
    pointerEvents="none"
/>
```

#### 解决方案 

* 将svg封装在另一个标签中，并将onClick事件添加到包装器中。点击时会触发该元素和其子元素,同时也需要将svg设置为pointerEvents="none",这是为了在svg禁用所有指针事件（包括点击事件）*

```tsx
<div
    className="refreshData"
    onClick={(e) => {
    e.stopPropagation();
    updateData(articleData?.uniqueId, articleData?.platform);
    }}
    onMouseEnter={() =>
    handleMouseEnter(articleData?.postId, articleData?.wxArticleLink === null)
    }
    onMouseLeave={() => handleMouseLeave(articleData?.postId)}
    style={{ cursor: 'pointer' }}
>
    <ReactSVG
    src={ articleData?.wxArticleLink !== null ? iconRefreshData : errLoginFlag}
    wrapper="span"
    className='refreshData'
    pointerEvents="none"
    />
</div>
```

## CSS中变量使用

* CSS出现变量，是如何起作用的*

#### 解答
* 在 CSS 中，color: var(--color-primary); 的意思是将元素的颜色设置为变量 --color-primary 的值。
var() 函数用于插入 CSS 变量的值。CSS 变量是一种自定义属性，可以在 CSS 中定义和使用，以便更方便地管理和修改样式。*

#### 使用
1. 在App.scss中全局定义
```scss
:root{
  --primary-bg-color: #e0e1ee;
  --second-bg-color: rgb(251, 251, 250);
  --primary-txt-color: #333;
  --second-txt-color: #999;
  --color-primary: #6B70FB;
```

2. 在需要用的地方使用var(xxx)来使用
```scss
color: var(--color-primary);
```

## 