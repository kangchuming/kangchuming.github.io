# 深拷贝实现

```javascript
/**
 * 深拷贝函数，支持对象、数组、循环引用
 * @param {any} obj - 需要拷贝的目标
 * @param {WeakMap} [cache=new WeakMap()] - 缓存已拷贝的对象，用于处理循环引用
 * @returns {any} 深拷贝后的新对象
 */
const deepClone = (obj, cache = new WeakMap()) => {
    // 1. 处理基本类型（number, string, boolean, null, undefined, symbol）和函数
    //    这些类型不需要深拷贝，直接返回即可
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 2. 检查缓存，如果已经拷贝过该对象，则直接返回缓存的结果
    //    这一步是处理循环引用的关键
    if (cache.has(obj)) {
        return cache.get(obj);
    }

    // 3. 根据目标类型初始化新对象（数组或普通对象）
    let newObj = Array.isArray(obj) ? [] : {};

    // 4. 将新对象存入缓存，必须在递归前存入，以处理循环引用
    cache.set(obj, newObj);

    // 5. 遍历对象的所有可枚举属性（不包括Symbol属性和原型链上的属性）
    for (let key in obj) {
        // 5.1 确保只处理对象自身的属性，不处理继承的属性
        if (obj.hasOwnProperty(key)) {
            // 5.2 递归拷贝每个属性值
            newObj[key] = deepClone(obj[key], cache);
        }
    }

    // 6. 返回深拷贝后的新对象
    return newObj;
}
```

## 实现思路

1. **处理基本类型和空值**：
   - 如果要拷贝的对象是基本类型（number、string、boolean、symbol）或 null、undefined 或函数，直接返回
   - 这些类型不需要深拷贝

2. **处理循环引用**：
   - 使用 WeakMap 作为缓存，存储已经拷贝过的对象
   - 在每次拷贝前先检查目标对象是否已经在缓存中
   - 如果存在，直接返回缓存的结果，避免无限递归

3. **创建新对象**：
   - 根据原对象类型（数组或普通对象）创建对应的空对象

4. **递归拷贝属性**：
   - 遍历原对象的所有自有属性
   - 对每个属性值递归调用深拷贝函数
   - 将拷贝结果赋值给新对象对应的属性

## 注意事项

- 该实现主要处理普通对象和数组
- 可以处理循环引用问题
- 只拷贝对象自身的可枚举属性，不包括原型链上的属性
- 不支持拷贝特殊对象，如 Map、Set、Date、RegExp 等