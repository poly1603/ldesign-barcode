import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '@ldesign/barcode',
  description: '强大的多框架条形码生成与扫描库',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      { text: '演示', link: '/guide/examples' },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/guide/frameworks/vue' },
          { text: 'React', link: '/guide/frameworks/react' },
          { text: 'Angular', link: '/guide/frameworks/angular' },
          { text: 'Svelte', link: '/guide/frameworks/svelte' },
          { text: 'Solid', link: '/guide/frameworks/solid' },
          { text: 'Qwik', link: '/guide/frameworks/qwik' },
          { text: 'Preact', link: '/guide/frameworks/preact' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '基础用法', link: '/guide/usage' },
          ]
        },
        {
          text: '框架集成',
          items: [
            { text: 'Vue', link: '/guide/frameworks/vue' },
            { text: 'React', link: '/guide/frameworks/react' },
            { text: 'Angular', link: '/guide/frameworks/angular' },
            { text: 'Svelte', link: '/guide/frameworks/svelte' },
            { text: 'Solid.js', link: '/guide/frameworks/solid' },
            { text: 'Qwik', link: '/guide/frameworks/qwik' },
            { text: 'Preact', link: '/guide/frameworks/preact' },
          ]
        },
        {
          text: '高级',
          items: [
            { text: '性能优化', link: '/guide/performance' },
            { text: '自定义主题', link: '/guide/theming' },
            { text: '常见问题', link: '/guide/faq' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'Core', link: '/api/core' },
            { text: 'Vue', link: '/api/vue' },
            { text: 'React', link: '/api/react' },
            { text: 'Angular', link: '/api/angular' },
            { text: 'Svelte', link: '/api/svelte' },
            { text: 'Solid.js', link: '/api/solid' },
            { text: 'Qwik', link: '/api/qwik' },
            { text: 'Preact', link: '/api/preact' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/barcode' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 ldesign'
    },

    search: {
      provider: 'local'
    }
  }
});
