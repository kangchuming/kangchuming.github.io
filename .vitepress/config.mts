import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  srcDir: './src',
  base: '/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Blog', link: '/' },
      { text: 'Home', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Project',
        items: [
          { text: '虚拟列表', link: '/project/virtual-list' },
          { text: '公共组件', link: '/project/public-components' },
          { text: '埋点', link: '/project/event-tracking' },
          { text: 'AB实验', link: '/project/AB-experiment' },
          { text: '权限管理', link: '/project/permission-management' },
          {
            text: '性能优化',
            items: [
              {
                text: '网络篇',
                items: [
                  { text: 'webpack性能调优', link: '/project/performanceOptimization/webpack' },
                  { text: '图片选择', link: '/project/performanceOptimization/picoption.md' },
                ]
              },
              {
                text: '存储篇',
                items: [
                  { text: '浏览器缓存机制', link: '/project/performanceOptimization/cache.md' }
                ]
              },
              {
                text: '代码篇',
                items: [
                  { text: '代码分割和预加载', link: '/project/performanceOptimization/codeSplit.md' }
                ]
              },
              {
                text: '性能指标',
                items: [
                  { text: '性能指标', link: '/project/performanceOptimization/quota.md' }
                ]
              }
            ]
          },
          {
            text: 'AI流式图文生成',
            items: [
              { text: 'review', link: '/project/AITextGeneration/review.md' }
            ]
          },
          {
            text: '微前端',
            items: [
              { text: '错误边界', link: '/project/microFront/errorBoundary.md' },
              { text: 'ShdowDOM', link: '/project/microFront/shadowDOM.md' },
              { text: '动态路由', link: '/project/microFront/router.md' }
            ]
          },
          {
            text: 'RAG',
            items: [
              { text: 'RAG', link: '/project/RAG/accuracy.md' }
            ]
          }
        ]
      },
      {
        text: '代码片段',
        items: [
          {
            text: 'CSS',
            items: [
              { text: 'CSS', link: '/codeSnippet/project/css/snippet.md' },
              { text: '多个styles', link: '/codeSnippet/project/css/24_9_24.md' },
              { text: 'clsx', link: '/codeSnippet/project/css/24_9_25.md' },
              { text: 'flex:1', link: '/codeSnippet/project/css/24_9_28.md' },
              { text: 'overflow溢出', link: '/codeSnippet/project/css/24_10_22.md' }
            ]
          },
          {
            text: 'network',
            items: [
              { text: '接口传参', link: '/codeSnippet/project/network/24_9_28.md' }
            ]
          },
          {
            text: 'ts',
            items: [
              { text: 'ts接口返回参数', link: '/codeSnippet/project/ts/24_9_28.md' } ,
              { text: '深拷贝', link: '/codeSnippet/project/ts/24_9_19.md' },
              { text: 'useRef', link: '/codeSnippet/project/ts/24_9_12.md' },
              { text: '条件逻辑', link: '/codeSnippet/project/ts/24_9_6.md' },
              { text: '点击事件挂载', link: '/codeSnippet/project/ts/24_10_8.md' },
              { text: '判断首次进入', link: '/codeSnippet/project/ts/24_10_9.md' },
              { text: '捕捉错误', link:'/codeSnippet/project/ts/24_10_17.md'}
            ]
          }
        ]
      },
      {
        text: '手写题',
        items: [
          {
            text: '单例模式', link: '/handwritten/singleton.md'
          },
          {
            text: '深拷贝', link: '/handwritten/deepClone.md'
          },
          {
            text: '寄生组合继承', link: '/handwritten/inheritance.md'
          },
          {
            text: 'class继承', link: '/handwritten/classInheritance.md'
          },
          {
            text: 'reduce实现map', link: '/handwritten/reduce-map.md'
          },
          {
            text: '手写promise', link: '/handwritten/myPromise.md'
          },
          {
            text: 'EventEmitter', link: '/handwritten/EventEmitter.md'
          },
          {
            text: '快速排序', link: '/handwritten/quicksort.md'
          }
        ]
      },
      {
        text: 'milvus',
        items: [
          { text: 'milvus调优', link: '/milvus/latency.md' }
        ]
      },
      {
        text: 'Frontend',
        items: [
          {
            text: 'React',
            items: [
              { text: 'React Vs Vue', link: '/frontend/react/react-vue' },
              { text: 'React Fiber', link: '/frontend/react/fiber.md' }
            ]
          },
          {
            text: 'Vue',
            items: [
              { text: '插槽', link: '/frontend/vue/slot.md' },
              { text: '错误边界', link: '/frontend/vue/capturedError.md' },
              { text: 'diff', link: '/frontend/vue/diff.md' }
            ]
          },
          {
            text: '网络',
            items: [
              { text: 'SSE', link: '/frontend/network/sse.md' },
              { text: '跨域', link: '/frontend/network/cors.md' },
              { text: '简单请求和复杂请求', link: '/frontend/network/simpleRequest.md' },
              { text: 'HTTPS', link: '/frontend/network/https.md' }
            ]
          },
          {
            text: 'ES6',
            items: [
              { text: '箭头函数', link: '/frontend/es6/arrowFunction.md' },
              { text: 'Generator', link: '/frontend/es6/generator.md' },
            ]
          },
          {
            text: 'TypeScript',
            items: [
            ]
          },
          {
            text: 'Node',
            items: [
              { text: '事件循环', link: '/frontend/node/eventLoop.md' }
            ]
          },
          {
            text: 'Next',
            items: [
              { text: '第三方依赖', link: '/frontend/next/third-party-dependencies' },
            ]
          },
          {
            text: 'V8',
            items: [
              { text: '编译器和解释器', link: '/frontend/v8/interpreter.md' },
              { text: '垃圾回收', link: '/frontend/v8/garbageCollection.md' }
            ]
          }
        ],
      },
      {
        text: 'Backtend',
        items: [
          {
            text: 'Node',
            items: [
              { text: '并发实现', link: '/server/node/cluster.md' },
              { text: '错误控制和redis限流', link: '/server/node/errorControl.md' }
            ]
          },
        ],
      },
      {
        text: 'Docker',
        items: [
          {
            text: '部署', link: '/docker/deploy.md'
          },
          {
            text: '镜像优化', link: '/docker/image.md'
          }
        ]
      },
      {
        text: 'MySQL',
        items: [
          {
            text: '考核总结', link: '/mysql/exam.md'
          }
        ]
      },
      {
        text: '面试记录',
        items: [
          {
            text: '腾讯',
            items: [
            ]
          },
          {
            text: '阿里巴巴',
            items: [
            ]
          },
          {
            text: '字节跳动',
            items: [
            ]
          },
          {
            text: '美团',
            items: [
            ]
          },
          {
            text: '京东',
            items: [
            ]
          },
          {
            text: '小红书',
            items: [
            ]
          },
          {
            text: '拼多多',
            items: [
            ]
          }
        ]
      },
      {text: '面试总结',
        items:[
          {text: '算法题',
            items: [
              {text: '数组中出现两次的值', link: '/interview/code/numberTwice.md'}
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})