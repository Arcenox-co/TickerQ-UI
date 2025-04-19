import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "TickerQ",
  head: [
    ['link', { rel: 'icon', href: '/arcenox-logo.svg' }]
  ],
  themeConfig: {
    logo: '/arcenox-logo.png',
    darkModeSwitchLabel: "dark",
    footer: {
      copyright: 'Copyright © 2023-present Arcenox',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Donate', link: 'https://www.paypal.com/donate?hosted_button_id=RSRE2QUK2AT3Q' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is TickerQ?', link: '/intro/what-is-tickerq' },
          { text: 'Dashboard Overview', link: '/intro/dashboard-overview' },
          { text: 'Comparison with Hangfire & Quartz.NET', link: '/comparison/comparison-other-libraries' }
        ]
      },
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'TickerQ Installation', link: '/setup/tickerq-core' },
          { text: 'EF Core Integration', link: '/setup/tickerq-ef-core' },
          { text: 'Dashboard Setup', link: '/setup/dashboard' }
        ]
      },
      {
        text: 'Core Concepts',
        collapsed: false,
        items: [
          { text: 'In-Memory vs EF Core', link: '/modes/mode-comparison' }
        ]
      },
      {
        text: 'Usage Examples',
        collapsed: false,
        items: [
          { text: 'Using In-Memory Mode', link: '/examples/in-memory-example' },
          { text: 'Using EF Core Mode', link: '/examples/in-database-example' }
        ]
      },
      {
        text: 'How To',
        collapsed: false,
        items: [
          { text: 'Convert to Async', link: '/how-to/to-async' },
          { text: 'Change Job Priority', link: '/how-to/change-priority' },
          { text: 'Handle Exceptions', link: '/how-to/handle-exceptions' },
          { text: 'Extend Entity Models', link: '/how-to/extend-entites' }
        ]
      },
      {
        text: 'API Reference',
        collapsed: false,
        items: [
          { text: 'TickerQ Host API', link: '/apis/host-api' }
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
