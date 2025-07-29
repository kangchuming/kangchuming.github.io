# 多状态机场景：拼团按钮状态管理

## 问题描述
在拼团功能中，需要根据不同的业务状态显示不同的按钮：
- 用户是否已加入拼团
- 拼团是否已满员
- 用户是否为拼团创建者

## 状态分析

### 状态维度
1. **拼团状态**：是否满员（`totalCount === limitCount`）
2. **用户状态**：是否已加入（`creatorId === memberSimpleDtoList[0]?.id`）
3. **按钮状态**：显示不同的操作按钮

### 状态组合
| 拼团状态 | 用户状态 | 按钮显示 | 说明 |
|---------|---------|---------|------|
| 未满员 | 已加入 | 立即邀请好友参团 | 团长邀请更多成员 |
| 未满员 | 未加入 | 立即参与拼团 | 新用户加入拼团 |
| 已满员 | 已加入 | 无按钮 | 拼团成功 |
| 已满员 | 未加入 | 继续拼团 | 拼团已满，引导新开团 |

## 代码实现对比

### 方案一：三元运算符嵌套（复杂）
```typescript
{(groupInfo?.creatorId === groupInfo?.memberSimpleDtoList[0]?.id && groupInfo?.totalCount !== groupInfo?.limitCount) ? (
  // 已加入但未满员
  <button className={s.inviteBtn} onClick={handleShare}>立即邀请好友参团</button>
) : (groupInfo?.creatorId !== groupInfo?.memberSimpleDtoList[0]?.id && groupInfo?.totalCount !== groupInfo?.limitCount) ? (
  // 未加入，可以参与
  <button className={s.joinGroupBtn} onClick={() => getComboSaleActivityRelGuideFn()}>立即参与拼团</button>
) : (groupInfo?.creatorId === groupInfo?.memberSimpleDtoList[0]?.id && groupInfo?.totalCount === groupInfo?.limitCount) ? null :
  (
    <button className={s.continueBtn}>继续拼团</button>
  )
}
```

**问题**：
- 逻辑复杂，难以理解
- 条件判断重复
- 可读性差
- 维护困难

### 方案二：状态机模式（推荐）
```typescript
{(() => {
  const isGroupFull = groupInfo?.totalCount === groupInfo?.limitCount;
  const isUserJoined = isUserJoinedRef.current;

  if (isGroupFull && isUserJoined) return null; // 拼团成功，不显示按钮
  if (isGroupFull && !isUserJoined) return <button className={s.continueBtn}>继续拼团</button>;
  if (!isGroupFull && isUserJoined) return <button className={s.inviteBtn} onClick={handleShare}>立即邀请好友参团</button>;
  if (!isGroupFull && !isUserJoined) return <button className={s.joinGroupBtn} onClick={() => getComboSaleActivityRelGuideFn()}>立即参与拼团</button>;

  return null; // 默认情况
})()}
```

**优势**：
- 逻辑清晰，易于理解
- 状态判断集中
- 可读性好
- 易于维护和扩展

## 最佳实践

### 1. 状态提取
```typescript
// 将复杂的状态判断提取为变量
const isGroupFull = groupInfo?.totalCount === groupInfo?.limitCount;
const isUserJoined = groupInfo?.creatorId === groupInfo?.memberSimpleDtoList[0]?.id;
```

### 2. 状态机模式
```typescript
// 使用 if-else 链替代三元运算符嵌套
const renderButton = () => {
  if (isGroupFull && isUserJoined) return null;
  if (isGroupFull && !isUserJoined) return <ContinueButton />;
  if (!isGroupFull && isUserJoined) return <InviteButton />;
  if (!isGroupFull && !isUserJoined) return <JoinButton />;
  return null;
};
```

### 3. 组件化
```typescript
// 将按钮抽取为独立组件
const InviteButton = () => (
  <button className={s.inviteBtn} onClick={handleShare}>
    立即邀请好友参团
  </button>
);

const JoinButton = () => (
  <button className={s.joinGroupBtn} onClick={() => getComboSaleActivityRelGuideFn()}>
    立即参与拼团
  </button>
);

const ContinueButton = () => (
  <button className={s.continueBtn}>
    继续拼团
  </button>
);
```

## 状态机设计原则

### 1. 状态明确
- 每个状态都有明确的定义
- 状态之间互斥且完整

### 2. 逻辑清晰
- 使用 if-else 链替代复杂的三元运算符
- 状态判断集中管理

### 3. 可维护性
- 状态变量命名清晰
- 逻辑易于理解和修改

### 4. 可扩展性
- 新增状态时只需添加新的条件分支
- 不影响现有逻辑

## 总结

多状态机场景中，推荐使用状态机模式：
1. **提取状态变量**：将复杂判断提取为清晰的布尔值
2. **使用 if-else 链**：替代复杂的三元运算符嵌套
3. **组件化按钮**：提高代码复用性和可维护性
4. **明确状态定义**：确保状态之间互斥且完整

这样可以使代码更加清晰、易读、易维护，同时保持良好的扩展性。

      