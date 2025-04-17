# CSS 居中方案总结

## 一、背景

在开发中经常遇到让元素在水平和垂直方向上都居中的需求，内容不仅限于文字，可能是图片或其他元素。居中是一个非常基础但重要的应用场景。

根据居中元素（子元素）的宽高是否已知，可以将居中方法分为两大类：
- 居中元素宽高已知
- 居中元素宽高未知

## 二、实现方式

### 1. 利用定位 + margin:auto

```html
<style>
    .father {
        width: 500px;
        height: 300px;
        border: 1px solid #0a3b98;
        position: relative;
    }
    .son {
        width: 100px;
        height: 40px;
        background: #f0a238;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

**实现原理**：
- 父级设置为相对定位，子级绝对定位
- 四个定位属性都设置为0，子级会被拉开到和父级一样宽高
- 设置子元素宽高后，再设置margin: auto实现居中

### 2. 利用定位 + margin:负值

```html
<style>
    .father {
        position: relative;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -50px;
        margin-top: -50px;
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

**实现原理**：
1. 初始位置为方块1的位置
2. 设置left、top为50%时，内部子元素移动到方块2的位置
3. 设置margin为负数，使内部子元素移动到方块3的位置（中间位置）

**特点**：
- 不要求父元素的高度固定
- 需要知道子元素自身的宽高

### 3. 利用定位 + transform

```html
<style>
    .father {
        position: relative;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

**实现原理**：
- translate(-50%, -50%)将元素位移自身宽度和高度的-50%
- 不需要知道自身元素的宽高

### 4. table布局

```html
<style>
    .father {
        display: table-cell;
        width: 200px;
        height: 200px;
        background: skyblue;
        vertical-align: middle;
        text-align: center;
    }
    .son {
        display: inline-block;
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

### 5. flex弹性布局

```html
<style>
    .father {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

**关键属性说明**：
- `display: flex`：容器内部元素按flex布局
- `align-items: center`：元素水平居中
- `justify-content: center`：元素垂直居中

### 6. grid网格布局

```html
<style>
    .father {
        display: grid;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        width: 10px;
        height: 10px;
        border: 1px solid red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

## 三、方案总结

### 1. 不需要知道元素宽高的方案
- 利用定位 + margin:auto
- 利用定位 + transform
- flex布局
- grid布局

### 2. 根据元素类型分类

#### 内联元素居中布局
**水平居中**：
- 行内元素：`text-align: center`
- flex布局：`display: flex; justify-content: center`

**垂直居中**：
- 单行文本：父元素设置`height === line-height`
- 多行文本：父元素设置`display: table-cell; vertical-align: middle`

#### 块级元素居中布局
**水平居中**：
- 定宽：`margin: 0 auto`
- 绝对定位：`left: 50% + margin: 负自身一半`

**垂直居中**：
- `position: absolute` + `left/top/margin-left/margin-top`（定高）
- `display: table-cell`
- `transform: translate(x, y)`
- flex布局（不定高，不定宽）
- grid布局（不定高，不定宽，兼容性较差）