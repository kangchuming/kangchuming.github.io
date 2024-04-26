# 菜单权限管理

在复杂的界面设计中，经常会遇到按钮过多的问题。为了避免界面显得臃肿，我们可以将部分按钮移至更多菜单内。然而，每个菜单选项的展示逻辑可能会根据来源帖子的类型和操作人的身份有所不同，如果单独编写，人力和时间成本会非常高。

为了解决这个问题，我们可以通过整合基础权限，如帖子拥有者、管理员、合集型帖子等，得出常用权限组合。然后，我们可以将权限组合与操作关联，这样只需传入操作枚举，即可自动决定操作的显示/隐藏。

这种方法不仅可以精准地控制菜单的打开，还可以保证调用的简易程度，提高菜单的可维护性，有效降低开发成本。

## 代码

```jsx
import React from 'react';

// 定义权限枚举
const Permissions = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  // ...
};

// 定义操作枚举
const Actions = {
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  // ...
};

// 定义映射，将每个操作映射到一个权限数组
const actionPermissions = {
  [Actions.EDIT]: [Permissions.OWNER, Permissions.ADMIN],
  [Actions.DELETE]: [Permissions.ADMIN],
  // ...
};

function Menu({ userPermission, actions }) {
  // 过滤掉当前用户无法执行的操作
  const availableActions = actions.filter(
    action => actionPermissions[action].includes(userPermission)
  );

  // 渲染一个菜单，其中包含所有可以执行的操作
  return (
    <div>
      {availableActions.map(action => (
        <button key={action}>{action}</button>
      ))}
    </div>
  );
}
```