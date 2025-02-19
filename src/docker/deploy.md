## 使用Docker部署前端项目

### 创建nginx.conf

```
# 用户及进程配置
user  nginx;
worker_processes  auto;  # 根据CPU核心数自动设置

events {
    worker_connections  1024;  # 每个worker的最大连接数
    multi_accept on;           # 同时接受多个连接
}

http {
    # 基础配置
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    tcp_nopush    on;         # 优化数据包发送
    tcp_nodelay   on;         # 禁用Nagle算法
    keepalive_timeout  65;    # 保持连接超时时间

    # 日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log main;
    error_log   /var/log/nginx/error.log warn;

    # Gzip压缩配置
    gzip on;
    gzip_min_length 1k;       # 最小压缩文件大小
    gzip_comp_level 6;        # 压缩级别（1-9）
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;             # 根据Accept-Encoding头返回不同内容
    gzip_disable "MSIE [1-6]\."; # 禁用旧版IE的压缩

    server {
        listen       80;
        server_name  localhost;

        # 安全响应头
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
        add_header Referrer-Policy "no-referrer-when-downgrade";

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
            root   /usr/share/nginx/html;
            expires 1y;                    # 缓存有效期1年
            add_header Cache-Control "public, immutable";
            access_log off;                # 关闭访问日志
        }

        # 主应用路由
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;

            # 禁止缓存HTML文件
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires 0;
        }

        # 错误页面配置
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }

        # 限制上传大小
        client_max_body_size 10m;  # 最大请求体10MB
    }

    # 请求限制
    limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s; # 每秒10个请求
} 
```

### 在src创建Dockerfile
```# 第一阶段：构建应用
FROM node:18-alpine AS builder
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖，包括开发依赖
RUN npm install

# 全局安装 typescript
RUN npm install -g typescript

# 复制源代码和配置文件
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 直接使用 vite build
RUN npm run build

# 第二阶段：部署到 nginx
FROM nginx:1.24-alpine
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
```
1. node:18-alpine  node alpine版本的基础镜像,镜像会小很多
2. 修改tsconfig.json
```
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "composite": true,
    "target": "ES2015",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "emitDeclarationOnly": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@api/*": ["src/api/*"],
      "@store/*": ["src/store/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts"],
}
```
3. 修改package.json的构建脚本
```
{
  "name": "src",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
  },
  "devDependencies": {
  }
}
```
4. 修改tsconfig.app.json
```
{
  "compilerOptions": {
    "composite": true,
    "emitDeclarationOnly": true,
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@api/*": ["src/api/*"],
      "@store/*": ["store/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@assets/*": ["src/assets/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "store/**/*.ts"],
  "exclude": ["node_modules"]
}
```
5. 修改tsconfig.node.json
```
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```
6. 修改vite.config.ts
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@types": path.resolve(__dirname, "src/types"),
      "@api": path.resolve(__dirname, "src/api"),
      "@store": path.resolve(__dirname, "store"),
    }
  },
  // 添加此配置
  define: {
    global: 'globalThis',
  }
})
```
### 通过Dockerfile构建镜像
```
docker build -t frontend-image .
```

### 通过镜像运行容器
```
docker run -itd -p 8081:80 --name frontend-container frontend-image
```

## 使用Docker部署Node后端服务
### 在node/src创建Dockerfile文件
```
FROM node:18-alpine
# 明确设置工作目录权限

WORKDIR /app
RUN chown -R node:node /app
# 先复制包管理文件
COPY package*.json ./
RUN npm install


# 复制其他文件
COPY --chmod=644 . .

RUN npm run build

# 使用非root用户
USER node

EXPOSE  7001
# 使用JSON格式CMD
CMD ["node", "dist/main.js"]
```

### 添加dockerignore
```
echo "node_modules" > .dockerignore
echo ".git" >> .dockerignore
echo ".vscode" >> .dockerignore
echo "dist" >> .dockerignore
echo "*.log" >> .dockerignore
```

### 构建镜像
```
docker build -t server-image .
```

### 启动容器
```
docker run -itd -p 7001:7001 --name server-container server-image
```

## 镜像导出及导入

**导出**
```
docker run -itd -p 7001:7001 --name server-container server-image
```
**导入**
```
docker load < frontend-image.tar
```