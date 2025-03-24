import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TurtlePanes 🐢",
  description: "Easily manage multi pane views",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/docs' },
    ],

    sidebar: [
      {
        text: 'React',
        items: [
          { text: 'Getting Started', link: '/react/getting-started' },
          { text: 'Properties', link: '/react/properties' },
          { text: 'Exposed Functions', link: '/react/exposed-functions' },
        ]
      },
      {
        text: 'Vue',
        items: [
          { text: 'Getting Started', link: '/vue/getting-started' },
          { text: 'Properties', link: '/vue/properties' },
          { text: 'Exposed Functions', link: '/vue/exposed-functions' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/altinselimi/turtle-panes' }
    ]
  }
})
