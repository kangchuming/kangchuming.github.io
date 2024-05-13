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
          { text: 'SSR', link: '/project/ssr' },
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
                  { text: 'SSR', link: '/project/performanceOptimization/ssr.md' },]
              },
              {
                text: '存储篇',
                items: [
                  {text: '浏览器缓存机制', link: '/project/performanceOptimization/cache.md'}
                ]
              },
            ]
          },
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
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'Vue',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'TypeScript',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'Node',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'Next',
            items: [
              { text: '第三方依赖', link: '/frontend/next/third-party-dependencies' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'JavaScript',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'Micro Frontends',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
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
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
          {
            text: 'SQL',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Markdown Examples', link: '/markdown-examples' }
            ]
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})