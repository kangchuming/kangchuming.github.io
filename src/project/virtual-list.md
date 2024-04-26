# 动态列表组件开发

在我之前的项目中，我面临一个挑战，那就是需要开发一个能够处理大量数据的列表组件，而且每个列表项的高度可能不同。传统的渲染方法会导致性能问题，因为它需要一次性渲染所有的列表项。此外，由于列表项的高度是动态的，所以在滚动过程中可能会出现页面闪烁的问题。

为了解决这个问题，我决定使用虚拟滚动的技术。虚拟滚动的基本思想是只渲染当前可见的列表项，这大大减少了需要渲染的列表项的数量，从而提高了性能。

我首先使用 `useState` 来跟踪滚动位置和所有列表项的位置。然后，我创建了一个 `genOffsets` 函数来计算每个列表项的位置，这个函数基于每个列表项的高度生成一个前缀和数组。这个数组是用来确定每个列表项在列表中的位置。

然后，我计算出当前可见的列表项的开始和结束索引，并只渲染这些列表项。这是通过查找 `offsets` 数组中第一个大于 `scrollTop` 和 `scrollTop + containerHeight` 的元素来实现的。

为了解决页面闪烁的问题，我使用了 `flushSync` 函数来同步更新滚动位置的状态。这样可以确保滚动位置的状态始终与实际的滚动位置保持一致，从而避免了页面闪烁的问题。

此外，我还添加了一个 `resetHeight` 方法，这个方法可以用于重置列表的高度。这是通过更新 `offsets` 状态变量来实现的，这个状态变量存储了所有列表项的位置。

通过使用虚拟滚动技术，我成功地开发了一个高性能的列表组件，它能够处理大量的列表项，而且每个列表项的高度可以动态变化。这个组件提供了流畅的滚动体验，即使在处理大量数据时也不会出现性能问题。此外，通过同步更新滚动位置的状态，我成功地解决了页面闪烁的问题。这个解决方案不仅满足了项目的需求，而且也提高了用户的体验。

## 代码

```javascript
import { forwardRef, useState } from 'react';
import { flushSync } from 'react-dom';

// 动态列表组件
const VariableSizeList = forwardRef(
  ({ containerHeight, getItemHeight, itemCount, itemData, children }, ref) => {
    ref.current = {
      resetHeight: () => {
        setOffsets(genOffsets());
      }
    };

    // children 语义不好，赋值给 Component
    const Component = children;
    const [scrollTop, setScrollTop] = useState(0); // 滚动位置

    // 根据 getItemHeight 生成 offsets
    // 本质是前缀和
    const genOffsets = () => {
      const a = [];
      a[0] = getItemHeight(0);
      for (let i = 1; i < itemCount; i++) {
        a[i] = getItemHeight(i) + a[i - 1];
      }
      return a;
    };

    // 所有 items 的位置
    const [offsets, setOffsets] = useState(() => {
      return genOffsets();
    });

    // 找 startIdx 和 endIdx
    // 这里用了普通的查找，更好的方式是二分查找
    let startIdx = offsets.findIndex((pos) => pos > scrollTop);
    let endIdx = offsets.findIndex((pos) => pos > scrollTop + containerHeight);
    if (endIdx === -1) endIdx = itemCount;

    const paddingCount = 2;
    startIdx = Math.max(startIdx - paddingCount, 0); // 处理越界情况
    endIdx = Math.min(endIdx + paddingCount, itemCount - 1);

    // 计算内容总高度
    const contentHeight = offsets[offsets.length - 1];

    // 需要渲染的 items
    const items = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const top = i === 0 ? 0 : offsets[i - 1];
      const height = i === 0 ? offsets[0] : offsets[i] - offsets[i - 1];
      items.push(
        <Component
          key={i}
          index={i}
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: '100%',
            height
          }}
          data={itemData}
        />
      );
    }

    return (
      <div
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative'
        }}
        onScroll={(e) => {
          flushSync(() => {
            setScrollTop(e.target.scrollTop);
          });
        }}
      >
        <div style={{ height: contentHeight }}>{items}</div>
      </div>
    );
  }
);
```

## 代码讲解

这段代码定义了一个名为 `VariableSizeList` 的 React 组件，它使用虚拟滚动技术来渲染具有不同高度的列表项。这种技术只渲染当前可见的列表项，从而提高性能。

以下是代码的详细解释：

- `forwardRef` 是 React 的一个函数，用于在函数组件中使用 ref。在这个组件中，ref 被用于暴露一个 `resetHeight` 方法，这个方法可以用于重置列表的高度。
- `containerHeight` 是列表的可见高度，`getItemHeight` 是一个函数，用于获取给定索引的列表项的高度，`itemCount` 是列表项的数量，`itemData` 是传递给列表项的数据，`children` 是渲染每个列表项的组件。
- `genOffsets` 函数用于生成一个数组，其中的每个元素是到当前索引为止的所有列表项的总高度。这个数组用于计算每个列表项的位置。
- `offsets` 是一个状态变量，用于存储所有列表项的位置。
- `startIdx` 和 `endIdx` 是当前可见的列表项的开始和结束索引。这两个索引是通过查找 `offsets` 数组中第一个大于 `scrollTop` 和 `scrollTop + containerHeight` 的元素来获取的。
- `paddingCount` 是一个常量，用于在可见区域之前和之后额外渲染的列表项的数量。这可以提高滚动的平滑性。
- `contentHeight` 是所有列表项的总高度，它等于 `offsets` 数组的最后一个元素。
- `items` 是需要渲染的列表项。对于每个需要渲染的列表项，它创建了一个 `Component` 元素，并设置了其 `key`、`index`、`style` 和 `data` 属性。
- 最后，这个组件返回一个包含所有需要渲染的列表项的 `div` 元素。这个 `div` 元素有一个滚动事件处理器，当滚动事件发生时，它会更新 `scrollTop` 状态变量。

这个组件的主要优点是它可以处理具有不同高度的列表项，并且只渲染当前可见的列表项，从而提高性能。但是，它的缺点是它需要预先知道每个列表项的高度，这在某些情况下可能是不可能的。