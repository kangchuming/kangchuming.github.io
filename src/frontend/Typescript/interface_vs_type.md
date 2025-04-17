# TypeScript Interface vs Type 对比指南

## 一、核心区别

| 特性 | interface | type |
|------|-----------|------|
| 声明合并 | ✅ 支持 | ❌ 不支持 |
| 扩展方式 | extends 继承 | & 交叉类型组合 |
| 类型范围 | 仅描述对象类型 | 可描述任意类型 |
| 复杂类型 | 不支持直接定义 | 支持联合、交叉、条件、映射等 |
| 实现（implements） | 类可通过 implements 实现 | 类可实现，但较少使用 |
| 类型别名 | 不能为基本类型起别名 | 可以（如 `type ID = string | number`） |

## 二、使用场景

### 1. 推荐使用 interface 的场景

#### 1.1 声明合并
```typescript
interface Window {
  myCustomProp: string;
}
```

#### 1.2 面向对象设计
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}
```

#### 1.3 对象类型定义
- 明确需要描述对象的结构
- 可能被多次扩展

### 2. 推荐使用 type 的场景

#### 2.1 联合类型或交叉类型
```typescript
type ID = string | number;
type Dog = Animal & { breed: string };
```

#### 2.2 元组或复杂类型
```typescript
type Point = [number, number];
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };
```

#### 2.3 类型工具操作
```typescript
const data = { x: 1, y: 2 };
type DataType = typeof data; // { x: number; y: number }
```

#### 2.4 类型别名
```typescript
type Callback = (result: string) => void;
```

## 三、声明合并详解

### 1. 基本概念
声明合并允许在多个地方声明同一个接口，TypeScript 会自动合并这些声明。

### 2. 使用示例

#### 2.1 基础合并
```typescript
interface Person {
  name: string;
  age: number;
}

interface Person {
  email: string;
}

// 合并后：
// interface Person {
//   name: string;
//   age: number;
//   email: string;
// }
```

#### 2.2 跨文件合并
```typescript
// user.ts
interface User {
  id: number;
  name: string;
}

// user-details.ts
interface User {
  email: string;
  isActive: boolean;
}
```

### 3. 适用场景
- 扩展已有接口
- 模块化开发
- 库扩展
- 类型增强

## 四、高级类型特性

### 1. 联合类型（Union Types）
```typescript
type ID = string | number;

function getUserId(id: ID) {
  console.log(id);
}
```

### 2. 元组类型（Tuple Types）
```typescript
type User = [string, number, boolean];
const user: User = ["John", 30, true];
```

### 3. 字面量类型（Literal Types）
```typescript
type Color = "red" | "green" | "blue";

function setBackgroundColor(color: Color) {
  console.log(`Background color set to ${color}`);
}
```

## 五、最佳实践

1. **优先使用 interface**：
   - 需要声明合并时
   - 定义对象类型时
   - 面向对象结构设计时

2. **优先使用 type**：
   - 需要联合、交叉类型时
   - 定义元组、复杂类型时
   - 使用类型工具时

3. **注意事项**：
   - 性能差异可以忽略
   - 遵循团队规范
   - 根据实际场景灵活选择

## 六、总结

- interface 更适合对象结构的层次化设计
- type 更灵活，适合复杂类型操作
- 两者在大多数情况下可以互换
- 理解差异有助于写出更清晰的代码