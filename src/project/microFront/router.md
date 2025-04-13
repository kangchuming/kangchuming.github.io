# Vue.js 与 React.js 微前端路由同步方案

## 一、概述
- 基于 Webpack 5 的 Module Federation 特性
- 实现不同框架应用间的代码和依赖共享
- 支持 Vue.js 动态加载 React.js 应用
- 实现跨框架路由同步

## 二、React 应用配置

### 1. Webpack 配置
```javascript
new ModuleFederationPlugin({
  name: "auth",
  filename: "remoteEntry.js",
  exposes: {
    "./AuthApp": "./src/bootstrap"
  },
  shared: dependencies
})
```

### 2. 模块暴露
- 通过 `exposes` 属性指定可被加载的模块
- 暴露 `./src/bootstrap` 作为远程应用入口点

## 三、Vue 应用配置

### 1. Webpack 配置
```javascript
new ModuleFederationPlugin({
  name: "container",
  remotes: {
    auth: "auth@http://localhost:8082/remoteEntry.js",
  },
  shared: dependencies
})
```

### 2. React 组件挂载
```vue
<template>
  <div id="react"></div>
</template>

<script>
import { mount } from "auth/AuthApp";

export default {
  mounted() {
    this.initialPath = this.$route.matched[0].path;
    const { onParentNavigate } = mount(document.getElementById("react"), {
      initialPath: this.initialPath,
      onNavigate: ({ pathname: nextPathname }) => {
        let mext = this.initialPath + nextPathname;
        if (this.$route.path !== mext) {
          this.$router.push(mext);
        }
      },
    });
    this.onParentNavigate = onParentNavigate;
  },
  watch: {
    $route(to, from) {
      let innerRoute = this.getInnerRoute(to.path);
      if (this.iswatch) {
        if (innerRoute) {
          this.onParentNavigate(innerRoute);
        } else return true;
      } else this.iswatch = true;
    },
  },
  methods: {
    getInnerRoute(path) {
      let inner = path.split(this.initialPath)[1];
      return inner;
    },
  },
};
</script>
```

## 四、路由同步实现

### 1. React 到 Vue 的路由同步
- 使用 history 库管理路由
- 路由变化时通过 `history.push` 或 `history.replace` 更新
- 触发 `onNavigate` 回调函数传递新路由信息

### 2. Vue 到 React 的路由同步
- 使用 Vue Router 管理路由
- 通过 watch 监听器检测路由变化
- 调用 `onParentNavigate` 回调函数传递新路由信息

## 五、应用运行

### 1. 使用 Lerna 管理
```bash
npx lerna init
lerna run start --stream
```

### 2. 运行说明
- Lerna 确保两个应用同时运行
- 支持应用间相互通信

## 六、总结
- Module Federation 实现跨框架代码共享
- 通过路由同步确保用户体验一致性
- 支持动态加载和通信
- 适用于微前端架构的场景