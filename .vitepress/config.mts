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
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Frontend',
        items: [
          {
            text: 'React',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
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
              { text: 'Markdown Examples', link: '/markdown-examples' },
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
