## 插槽

### 作用

1. 组件复用
   父组件可以复用子组件的框架，只需要修改插槽内容。

2. 解耦 UI 结构
   子组件负责框架逻辑，父组件负责具体内容，实现 UI 和逻辑的分离。

3. 灵活定制
   允许父组件动态插入任意内容（包括 HTML、其他组件等），增强组件的可配置性。

### 类型

1. 默认插槽（匿名插槽）
   1. 作用：父组件传递的内容会填充到子组件的默认插槽位置。
   2. 子组件：通过 `<slot>` 标签定义插槽位置。

   ```vue
   <!-- 子组件 Child.vue -->
   <template>
     <div class="child">
       <h3>子组件标题</h3>
       <slot>默认内容（如果父组件不传内容，则显示这里）</slot>
     </div>
   </template>
   ```

   ```vue
   <!-- 父组件 Parent.vue -->
   <template>
     <Child>
       <p>这是父组件插入的内容</p>
     </Child>
   </template>
   ```

2. 具名插槽
   1. 作用：当子组件有多个插槽时，通过名字区分不同位置。
   2. 子组件：使用 name 属性命名插槽。

   ```vue
   <!-- 子组件 Layout.vue -->
   <template>
     <div class="container">
       <header>
         <slot name="header"></slot>
       </header>
       <main>
         <slot></slot> <!-- 默认插槽（无 name） -->
       </main>
       <footer>
         <slot name="footer"></slot>
       </footer>
     </div>
   </template>
   ```

   ```vue
   <!-- 父组件 Parent.vue -->
   <template>
     <Layout>
       <template v-slot:header>
         <h1>这是头部</h1>
       </template>

       <!-- 默认插槽内容（不指定 name） -->
       <p>这是主体内容</p>

       <template #footer>
         <p>这是底部</p>
       </template>
     </Layout>
   </template>
   ```

3. 作用域插槽
   1. 作用：子组件将数据传递给插槽，父组件可以基于这些数据自定义内容。
   2. 子组件：在 `<slot>` 上绑定数据（类似 props）。

   ```vue
   <!-- 子组件 List.vue -->
   <template>
     <ul>
       <li v-for="item in items" :key="item.id">
         <slot :item="item"></slot>
       </li>
     </ul>
   </template>

   <script>
   export default {
     data() {
       return { items: [{ id: 1, text: 'A' }, { id: 2, text: 'B' }] };
     },
   };
   </script>
   ```

   ```vue
   <!-- 父组件 Parent.vue -->
   <template>
     <List>
       <template v-slot:default="slotProps">
         <span>{{ slotProps.item.text }}</span>
       </template>
     </List>
   </template>
   ```

### 总结

- 默认插槽：简单内容分发。
- 具名插槽：多插槽场景下的精准分发。
- 作用域插槽：子组件向父组件传递数据，实现内容动态渲染。