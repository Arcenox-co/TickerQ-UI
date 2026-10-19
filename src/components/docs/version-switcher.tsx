'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { docsVersions, type DocsVersion } from '@/lib/docs-versions';

const editions: { version: DocsVersion; title: string; badge: string; description: string }[] = [
  { version: '5.x', title: 'TickerQ 5.x', badge: 'Commercial', description: 'Community, Evaluation, and paid plans' },
  { version: 'legacy', title: 'Legacy', badge: 'Open source', description: 'Documentation for earlier releases' },
];

export function VersionSwitcher({ version, destinations }: {
  version: DocsVersion;
  destinations: Record<DocsVersion, string>;
}) {
  const [open, setOpen] = useState(false);
  const selectedLink = useRef<HTMLAnchorElement>(null);
  const headingId = useId();
  const current = editions.find(item => item.version === version)!;

  return (
    <div className="mb-3">
      <p className="mb-2 px-1 text-xs font-medium text-fd-muted-foreground">Documentation</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          data-version={version}
          aria-label={`Documentation version: ${docsVersions[version].label}`}
          className="group flex min-h-11 w-full items-center gap-3 rounded-lg border border-fd-border bg-fd-secondary/40 px-2.5 py-2 text-start transition-colors hover:border-fd-primary/30 hover:bg-fd-accent data-[state=open]:border-fd-primary/40 data-[state=open]:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary"
        >
          <span className="shrink-0 rounded-md border border-fd-border bg-fd-background px-2 py-1 text-xs font-semibold tabular-nums text-fd-foreground">
            {version === '5.x' ? '5.x' : 'Legacy'}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-fd-foreground">{current.badge}</span>
          <ChevronDown className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-data-[state=open]:rotate-180" aria-hidden />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          collisionPadding={12}
          aria-labelledby={headingId}
          className="w-72 min-w-0 max-w-[calc(100vw-24px)] bg-fd-popover p-1.5"
          onOpenAutoFocus={event => {
            if (selectedLink.current) { event.preventDefault(); selectedLink.current.focus(); }
          }}
        >
          <p id={headingId} className="px-2.5 pb-2 pt-1.5 text-xs font-medium text-fd-muted-foreground">Choose documentation</p>
          <nav aria-label="Documentation versions" className="space-y-1">
            {editions.map(item => (
              <Link
                key={item.version}
                href={destinations[item.version]}
                ref={item.version === version ? selectedLink : undefined}
                aria-current={item.version === version ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-2.5 py-2.5 outline-none transition-colors hover:bg-fd-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-primary ${item.version === version ? 'bg-fd-primary/10' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{item.title}</span>
                  <span className="text-xs text-fd-muted-foreground">{item.badge}</span>
                  {item.version === version && <Check className="ml-auto size-3.5 text-fd-primary" aria-hidden />}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-fd-muted-foreground">{item.description}</span>
              </Link>
            ))}
          </nav>
          <div className="mx-2.5 mb-1 mt-3 border-t border-fd-border pt-3">
            <p className="text-[11px] font-medium text-fd-muted-foreground">5.x package versions by .NET target</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              {['8', '9', '10'].map(target => (
                <div key={target} className="rounded-md bg-fd-muted/60 py-2">
                  <dt className="text-[10px] text-fd-muted-foreground">.NET {target}</dt>
                  <dd className="mt-0.5 font-mono text-[11px] font-medium">{target}.5.x</dd>
                </div>
              ))}
            </dl>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
