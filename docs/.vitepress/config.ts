import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "TickerQ",
  description: "A powerful job scheduling library for .NET by Albert Kunushevci",
  head: [
    ['link', { rel: 'icon', href: '/arcenox-logo.svg' }],
    ['meta', { name: 'author', content: 'Albert Kunushevci' }],
    ['meta', { property: 'og:author', content: 'Albert Kunushevci' }],
    ['script', { async: 'true', src: 'https://www.googletagmanager.com/gtag/js?id=G-D81DHQQ8WB' }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-D81DHQQ8WB');
    `]
  ],
  themeConfig: {
    logo: '/arcenox-logo.png',
    darkModeSwitchLabel: "dark",
    footer: {
      copyright: 'Copyright © 2023-present Arcenox',
      message: 'Built by Albert Kunushevci',
    },
    nav: [
      { text: 'Guide', link: '/getting-started/installation' },
      { text: 'API Reference', link: '/api-reference/managers/index' },
      { text: 'Examples', link: '/examples/complete-example' },
      { 
        text: 'v8+', 
        items: [
          { text: 'v2.5.x (Legacy)', link: 'https://v2.tickerq.net' }
        ]
      }
    ],
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/introduction/what-is-tickerq' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Quick Start', link: '/getting-started/quick-start' }
          ]
        },
        {
          text: 'Essentials',
          collapsed: false,
          items: [
            {
              text: 'Core Concepts',
              items: [
                { text: 'Job Types', link: '/concepts/job-types' },
                { text: 'Job Fundamentals', link: '/concepts/job-fundamentals' },
                { text: 'Job Chaining', link: '/concepts/job-chaining' },
                { text: 'Job Priorities', link: '/concepts/job-priorities' },
                { text: 'Constructor Injection', link: '/concepts/constructor-injection' },
                { text: 'Error Handling', link: '/concepts/error-handling' }
              ]
            }
          ]
        },
        {
          text: 'Integration',
          collapsed: false,
          items: [
            {
              text: 'Entity Framework Core',
              items: [
                { text: 'Overview', link: '/features/entity-framework' },
                { text: 'Installation', link: '/features/entity-framework/installation' },
                {
                  text: 'Setup',
                  items: [
                    { text: 'Overview', link: '/features/entity-framework/setup/index' },
                    { text: 'Built-in TickerQDbContext', link: '/features/entity-framework/setup/built-in-dbcontext' },
                    { text: 'Application DbContext', link: '/features/entity-framework/setup/application-dbcontext' },
                    { text: 'Custom Entities', link: '/features/entity-framework/setup/custom-entities' }
                  ]
                },
                { text: 'Migrations', link: '/features/entity-framework/migrations' }
              ]
            },
            {
              text: 'Dashboard',
              items: [
                { text: 'Overview', link: '/features/dashboard' },
                { text: 'Installation', link: '/features/dashboard/installation' },
                { text: 'Setup', link: '/features/dashboard/setup' },
                { text: 'Authentication', link: '/features/dashboard/authentication' },
                { text: 'Screenshots', link: '/features/dashboard#dashboard-screenshots' }
              ]
            },
            {
              text: 'Redis Caching',
              items: [
                { text: 'Overview', link: '/features/redis' }
              ]
            },
            {
              text: 'OpenTelemetry',
              items: [
                { text: 'Overview', link: '/features/opentelemetry' }
              ]
            }
          ]
        },
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Complete Example', link: '/examples/complete-example' },
            {
              text: 'Cookbook',
              items: [
                { text: 'Overview', link: '/examples/cookbook/index' },
                { text: 'Email Notifications', link: '/examples/cookbook/email-notifications' },
                { text: 'Database Cleanup', link: '/examples/cookbook/database-cleanup' },
                { text: 'API Polling', link: '/examples/cookbook/api-polling' },
                { text: 'Workflow Orchestration', link: '/examples/cookbook/workflow-orchestration' },
                { text: 'Scheduled Reports', link: '/examples/cookbook/scheduled-reports' },
                { text: 'Batch Processing', link: '/examples/cookbook/batch-processing' },
                { text: 'Retry Strategies', link: '/examples/cookbook/retry-strategies' },
                { text: 'Data Synchronization', link: '/examples/cookbook/data-synchronization' },
                { text: 'Scheduled Maintenance', link: '/examples/cookbook/scheduled-maintenance' }
              ]
            }
          ]
        },
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Attributes', link: '/api-reference/attributes' },
            { text: 'Diagnostics', link: '/api-reference/diagnostics' },
            {
              text: 'Managers',
              items: [
                { text: 'Overview', link: '/api-reference/managers/index' },
                { text: 'TimeTickerManager', link: '/api-reference/managers/time-ticker-manager' },
                { text: 'CronTickerManager', link: '/api-reference/managers/cron-ticker-manager' },
                { text: 'TickerResult', link: '/api-reference/managers/ticker-result' }
              ]
            },
            {
              text: 'Entities',
              items: [
                { text: 'Overview', link: '/api-reference/entities/index' },
                { text: 'BaseTickerEntity', link: '/api-reference/entities/base-entity' },
                { text: 'TimeTickerEntity', link: '/api-reference/entities/time-ticker-entity' },
                { text: 'CronTickerEntity', link: '/api-reference/entities/cron-ticker-entity' },
                { text: 'CronTickerOccurrenceEntity', link: '/api-reference/entities/cron-occurrence-entity' },
                { text: 'Enums', link: '/api-reference/entities/enums' },
                { text: 'Custom Entities', link: '/api-reference/entities/custom-entities' }
              ]
            },
            {
              text: 'Configuration',
              items: [
                { text: 'Overview', link: '/api-reference/configuration/index' },
                {
                  text: 'Core Configuration',
                  items: [
                    { text: 'Overview', link: '/api-reference/configuration/core-configuration' },
                    { text: 'Scheduler', link: '/api-reference/configuration/core-configuration/scheduler-configuration' },
                    { text: 'Exception Handling', link: '/api-reference/configuration/core-configuration/exception-handling' },
                    { text: 'Start Mode', link: '/api-reference/configuration/core-configuration/start-mode' },
                    { text: 'Background Services', link: '/api-reference/configuration/core-configuration/background-services' }
                  ]
                },
                {
                  text: 'Entity Framework',
                  items: [
                    { text: 'Overview', link: '/api-reference/configuration/entity-framework-configuration' },
                    { text: 'DbContext Setup', link: '/api-reference/configuration/entity-framework-configuration/dbcontext-setup' },
                    { text: 'Connection & Pooling', link: '/api-reference/configuration/entity-framework-configuration/connection-pooling' },
                    {
                      text: 'Seeding',
                      items: [
                        { text: 'Overview', link: '/api-reference/configuration/seeding/index' },
                        { text: 'Automatic Seeding', link: '/api-reference/configuration/seeding/automatic-seeding' },
                        { text: 'Custom Seeding', link: '/api-reference/configuration/seeding/custom-seeding' },
                        { text: 'Disable Seeding', link: '/api-reference/configuration/seeding/disable-seeding' }
                      ]
                    }
                  ]
                },
                {
                  text: 'Dashboard',
                  items: [
                    { text: 'Overview', link: '/api-reference/configuration/dashboard-configuration' },
                    { text: 'Basic Setup', link: '/api-reference/configuration/dashboard-configuration/basic-setup' },
                    { text: 'Authentication', link: '/api-reference/configuration/dashboard-configuration/authentication' }
                  ]
                },
                { text: 'Redis', link: '/api-reference/configuration/redis-configuration' },
                { text: 'OpenTelemetry', link: '/api-reference/configuration/opentelemetry-configuration' }
              ]
            }
          ]
        },
        {
          text: 'Support',
          collapsed: false,
          items: [
            { text: 'Common Issues', link: '/troubleshooting/common-issues' },
            { text: 'Debugging', link: '/troubleshooting/debugging' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Arcenox-co/TickerQ' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/albertkunushevci/' }
    ],
    search: {
      provider: 'local'
    },
  }
});
