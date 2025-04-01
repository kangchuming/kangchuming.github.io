## 实现一个单例模式
```
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
```

### 代码
```
class Singleton {
    constrctor() {
        if(!Singleton.instance) {
            Singleton.instance = this;
        }
        return Singleton.instance;
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Singleton();
        }
        return this.instance();
    }
}
```

### 原理解析
```
constrctor() {
        if(!Singleton.instance) {
            Singleton.instance = this;
        }
        return Singleton.instance;
    }
```
- this是指向构造时的对象，
```
const tempObj = {};
Singleton.call(tempObj); // 此时构造函数内的 this 就是 tempObj
return tempObj;
```
- 第二次构造时，由于已经有实例了，所以仍然返回tempObj, 返回true;

- static getInstance 中this 指向 Singleton 类
```
console.log('\n-- 方式2: getInstance 调用 --');
const c = Singleton.getInstance(); // 输出 "通过 getInstance 创建" → 接着触发 "创建新实例"
const d = Singleton.getInstance(); // 无输出
console.log(c === d);      // true
```