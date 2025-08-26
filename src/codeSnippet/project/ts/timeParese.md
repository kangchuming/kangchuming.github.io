### 使用 dayjs 将时间戳格式化为“年-月-日 时:分:秒”

在前端开发中，常需要把后端返回的时间戳转为可读格式。本文总结如何使用 dayjs 的 `format()` 实现时间戳到标准时间字符串的转换。

## 安装
```bash
pnpm add dayjs
# 或：npm i dayjs / yarn add dayjs
```

## 基础用法
```ts
import dayjs from 'dayjs';

const tsMs = 1688716800000; // 毫秒时间戳
const s1 = dayjs(tsMs).format('YYYY-MM-DD HH:mm:ss'); // 2023-07-07 12:00:00

const tsSec = 1688716800; // 秒时间戳
const s2 = dayjs(tsSec * 1000).format('YYYY-MM-DD HH:mm:ss');
```

## 常用格式模板
- 日期：`YYYY-MM-DD`
- 时间：`HH:mm:ss`
- 完整：`YYYY-MM-DD HH:mm:ss`
- 中文：`YYYY年MM月DD日 HH:mm:ss`
- 月日时分：`MM-DD HH:mm`

## 封装工具函数
```ts
import dayjs from 'dayjs';

export function formatTs(
  ts: number | string | Date,
  pattern = 'YYYY-MM-DD HH:mm:ss',
  isSeconds = false
) {
  const value = typeof ts === 'number' && isSeconds ? ts * 1000 : ts;
  const d = dayjs(value);
  return d.isValid() ? d.format(pattern) : '';
}
```

## 时区与本地化
如需严格时区处理，使用插件 `utc`、`timezone`、`locale`。
```ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/zh-cn';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('zh-cn');

// 按上海时区显示
dayjs(tsMs).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
```

## 常见坑与建议
- 时间戳单位要分清：后端常给“秒”，dayjs 接受“毫秒”，需乘以 1000。
- `format` 区分大小写：`MM` 月、`mm` 分钟；`DD` 日、`dd` 星期简写。
- 无效日期处理：用 `isValid()` 兜底，避免渲染 `Invalid Date`。
- 跨端/SSR：尽量明确时区，避免本地时区差异引发错乱。
- 性能：批量格式化时，尽量减少重复计算、必要时复用结果。

## 示例合集
```ts
dayjs(1700000000000).format('YYYY-MM-DD HH:mm:ss'); // 2023-11-14 22:13:20
dayjs(1700000000 * 1000).format('YYYY年MM月DD日 HH:mm:ss'); // 中文
dayjs().startOf('day').format('YYYY-MM-DD 00:00:00'); // 当天零点
dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss'); // 三天后
```
