import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import {
  Activity,
  Book,
  ChatBubble,
  Cpu,
  Database,
  Flask,
  Server,
  ViewGrid,
} from 'iconoir-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';

function TabIcon({
  icon: Icon,
  color,
}: {
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="flex size-full items-center justify-center rounded-md"
      style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      <Icon className="size-3.5" />
    </div>
  );
}

const tabs: LayoutTab[] = [
  {
    title: 'TickerQ (Core)',
    url: '/docs',
    icon: <TabIcon icon={Cpu} color="var(--core-color)" />,
    props: { style: { '--tab-color': 'var(--core-color)' } as React.CSSProperties },
  },
  {
    title: 'TickerQ.Dashboard',
    url: '/docs/dashboard',
    icon: <TabIcon icon={ViewGrid} color="var(--dashboard-color)" />,
    props: { style: { '--tab-color': 'var(--dashboard-color)' } as React.CSSProperties },
  },
  {
    title: 'TickerQ.EntityFrameworkCore',
    url: '/docs/entity-framework',
    icon: <TabIcon icon={Database} color="var(--entity-framework-color)" />,
    props: { style: { '--tab-color': 'var(--entity-framework-color)' } as React.CSSProperties },
  },
  {
    title: 'TickerQ.Redis',
    url: '/docs/redis',
    icon: <TabIcon icon={Server} color="var(--redis-color)" />,
    props: { style: { '--tab-color': 'var(--redis-color)' } as React.CSSProperties },
  },
  {
    title: 'TickerQ.OpenTelemetry',
    url: '/docs/opentelemetry',
    icon: <TabIcon icon={Activity} color="var(--opentelemetry-color)" />,
    props: { style: { '--tab-color': 'var(--opentelemetry-color)' } as React.CSSProperties },
  },
  {
    title: 'API Reference',
    url: '/docs/api-reference',
    icon: <TabIcon icon={Book} color="var(--api-reference-color)" />,
    props: { style: { '--tab-color': 'var(--api-reference-color)' } as React.CSSProperties },
  },
  {
    title: 'Examples',
    url: '/docs/examples',
    icon: <TabIcon icon={Flask} color="var(--examples-color)" />,
    props: { style: { '--tab-color': 'var(--examples-color)' } as React.CSSProperties },
  },
];

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      tabs={tabs}
      sidebar={{ defaultOpenLevel: 2 }}
      {...baseOptions()}
    >
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              color: 'secondary',
              className: 'text-fd-muted-foreground rounded-2xl',
            }),
          )}
        >
          <ChatBubble className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>
      {children}
    </DocsLayout>
  );
}
