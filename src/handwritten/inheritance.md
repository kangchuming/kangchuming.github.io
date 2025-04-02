# JavaScript 原型继承实现

在 ES6 之前，JavaScript 通过原型链实现继承。下面是一个完整的原型继承实现示例，展示了如何正确设置原型链和构造函数。

## 实现代码

```javascript
function Parent(val) {
    this.val = val;
}

Parent.prototype.getValue = function() {
    console.log(this.val);
}

function Child(val) {
    Parent.call(this, val);
}

Child.prototype = Object.create(Parent.prototype, {
    constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true
    },
})

let child = new Child(1);
child.getValue(); // 输出: 1

console.log(child instanceof Parent); // 输出: true
```

## 继承实现步骤解析

1. **构造函数继承**：
   - 使用 `Parent.call(this, val)` 在 `Child` 构造函数内调用父构造函数
   - 这一步继承了父类的实例属性

2. **原型链继承**：
   - 使用 `Object.create(Parent.prototype)` 创建一个新对象，以父类原型为原型
   - 将这个新对象赋值给子类的原型 `Child.prototype`
   - 这一步继承了父类的原型方法

3. **修复构造函数指向**：
   - 设置 `Child.prototype.constructor = Child`
   - 确保实例的 `constructor` 属性正确指向子类构造函数
   - 使用属性描述符设置 `constructor` 属性为不可枚举

## 这种继承方式的优点

- **属性隔离**：每个实例有自己的属性副本，不会相互影响
- **方法共享**：所有实例共享原型方法，节省内存
- **instanceof 生效**：`child instanceof Parent` 返回 `true`，表明继承关系正确
- **构造函数正确**：实例的 `constructor` 属性正确指向子类构造函数

## 注意事项

- 必须先继承属性（调用父构造函数），再继承方法（设置原型）
- 使用 `Object.create()` 比直接赋值原型更安全
- 需要手动修复 `constructor` 属性