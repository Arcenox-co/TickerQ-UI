import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "TickerQ",
  themeConfig: {
    darkModeSwitchLabel: "dark",
    footer: {
      copyright: 'Copyright © 2023-present Albert Kunushevci',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Donate', link: 'https://www.paypal.com/donate?hosted_button_id=RSRE2QUK2AT3Q' },
    ],
    sidebar: [
      {
        text: 'Introducton',
        collapsed: false,
        items: [
          { text: 'What is TickerQ?', link: '/intro/what-is-tickerq' },
          { text: 'Getting Started', link: '/intro/getting-started' },
          { text: 'TickerQ EF Core', link: '/intro/tickerq-ef-core' },
        ]
      },
      {
        text: 'Examples',
        collapsed: false,
        items: [
          { text: 'In-Memory Backgound Job', link: '/examples/in-memory-example.md' },
          { text: 'In-Database Background Job', link: '/examples/in-database-example.md' },
        ]
      },
      {
        text: 'How To',
        collapsed: false,
        items: [
          { text: 'To Async Method', link: '/how-to/to-async.md' },
          { text: 'Change Priority', link: '/how-to/change-priority.md' },
          { text: 'Handle Exceptions', link: '/how-to/handle-exceptions.md' },
          { text: 'Extend Entites', link: '/how-to/extend-entites.md' },
          { text: 'Adjust Request Data', link: '/how-to/adjust-request-data.md' }
        ]
      },
      {
        text: "API's",
        collapsed: false,
        items: [
          { text: "TickerQ Host API", link: '/apis/host-api.md' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/arcenox/TickerQ' }
    ],
    search: {
      provider: 'local'
    },
  }
});
