# JavaScript 类继承

ES6 提供了类（class）这个概念，作为对象的模板。通过 `class` 关键字，可以定义类，实现继承更加方便。

## 基本示例

下面是一个简单的类继承示例：

```javascript
class Parent {
    constructor(val) {
        this.val = val;
    }

    getValue() {
        console.log(this.val);
    }
}

class Child extends Parent {
    constructor(val) {
        super(val);
    }
}

let child = new Child(1);
child.getValue(); // 输出: 1

console.log(child instanceof Parent); // 输出: true
```

## 继承原理解析

1. **类声明**：使用 `class` 关键字声明一个类
2. **构造函数**：通过 `constructor` 方法定义构造函数
3. **继承**：使用 `extends` 关键字实现继承
4. **super 调用**：在子类构造函数中，必须先调用 `super()` 才能使用 `this`
5. **实例关系**：子类实例同时也是父类的实例，`instanceof` 检测结果为 `true`

## 特点

- 类继承使用 `extends` 关键字
- 子类必须在 `constructor` 中调用 `super()`
- 子类可以继承父类的方法和属性
- ES6 的类继承本质上是原型继承的语法糖
- 类声明不会提升，与函数不同
