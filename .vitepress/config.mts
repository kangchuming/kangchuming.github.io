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
              }
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
            text: 'Promise', link: '/handwritten/promise.md'
          }
        ]
      },
      {
        text: 'Frontend',
        items: [
          {
            text: 'React',
            items: [
              { text: 'React Vs Vue', link: '/frontend/react/react-vue' },
            ]
          },
          {
            text: 'Vue',
            items: [
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
            ]
          },
          {
            text: 'Next',
            items: [
              { text: '第三方依赖', link: '/frontend/next/third-party-dependencies' },
            ]
          },
          {
            text: 'JavaScript',
            items: [
            ]
          },
          {
            text: 'Micro Frontends',
            items: [
            ]
          },
        ],
      },
      {
        text: 'Backtend',
        items: [
          {
            text: 'Java',
            items: [
            ]
          },
          {
            text: 'SQL',
            items: [
            ]
          },
        ],
      },
      {
        text: 'Docker',
        items: [
          {
            text: '部署', link: '/docker/deploy.md'
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
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})