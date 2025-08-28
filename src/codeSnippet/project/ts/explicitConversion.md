### JavaScript 数字转换正确用法（精简版）

当 `Number(xxx)` 返回 `NaN`，通常是输入包含非数字字符、空内容未按预期、或格式不被解析。以下为正确、安全的数字转换方式与注意点。

## 一、常用方式对比
- `Number(value)`: 严格整体转换，不可部分解析；失败即 `NaN`
- `parseInt(value, 10)`: 解析到第一个非数字字符处（仅整数），务必传入基数 `10`
- `parseFloat(value)`: 类似 `parseInt`，但支持小数
- 一元加号 `+value`: 等同 `Number(value)`，语义更简洁

## 二、`Number()` 规则要点
- 去除首尾空白再解析
- 空字符串 `''`、空白字符串 `'  '` → `0`
- `null` → `0`，`undefined` → `NaN`
- 布尔：`true` → `1`，`false` → `0`
- 纯数字字符串可转换：`'123'`、`'-1.5'`、`'0x11'`(→17)
- 含逗号/中文/单位等 → `NaN`（如 `'1,234'`、`'12px'`）

示例：
```js
Number('')        // 0
Number('  ')      // 0
Number('123')     // 123
Number('12px')    // NaN
Number(undefined) // NaN
+'3.14'           // 3.14
```

## 三、`parseInt/parseFloat` 适用场景
- 允许“部分数字前缀”：
```js
parseInt('12px', 10)   // 12
parseFloat('3.5kg')    // 3.5
```
- 指定基数避免八进制坑：
```js
parseInt('08', 10)     // 8
```

## 四、实用安全封装
- 仅接受“完全数字”的字符串，避免误解析：
```js
function toNumberStrict(input) {
  if (typeof input === 'number') return Number.isFinite(input) ? input : NaN;
  if (typeof input !== 'string') return NaN;
  const s = input.trim();
  if (s === '') return NaN;
  // 允许可选符号、整数或小数（不含千分位、下划线）
  if (!/^[+-]?(?:\d+|\d+\.\d+|\.\d+)$/.test(s)) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
```

## 五、常见坑与建议
- 避免带逗号/空格/单位：先清洗再转
  - 如：`'1,234.56'` → `str.replace(/,/g, '')`
- 强校验用 `Number.isFinite(n)`，不要用全局 `isFinite`
- 表单输入建议：前端限制字符，或失焦时标准化
- 需要“前缀数字”时用 `parseInt/parseFloat`；要求“全量有效数字”用 `Number` 或上面的严格函数

## 六、快速选择
- “必须整体有效数字” → `Number`/`+`（失败即 `NaN`）
- “字符串含单位/尾部字符” → `parseInt/parseFloat`
- “要最稳健” → 先清洗，再用严格校验转换