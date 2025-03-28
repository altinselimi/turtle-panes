import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TurtlePanes 🐢",
  description: "Easily manage multi pane views",
  head: [['script', {}, `
    (async () => {
      try {
        const script = document.createElement("script");
        script.defer = true;
        script.src = "https://cloud.umami.is/script.js";
        script.dataset.websiteId = "19647df5-af82-427b-976f-a2e6f1246a57";
        document.body.appendChild(script);
      } catch (error) {
        console.error('Failed to load tracking script:', error);
      }
    })();
  `]],
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
