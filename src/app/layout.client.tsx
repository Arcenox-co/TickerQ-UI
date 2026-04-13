'use client';

import { useParams } from 'next/navigation';
import { type ReactNode } from 'react';

function getSection(slug: string | undefined): string {
  if (!slug) return 'section-core';
  const map: Record<string, string> = {
    dashboard: 'section-dashboard',
    'entity-framework': 'section-entity-framework',
    redis: 'section-redis',
    opentelemetry: 'section-opentelemetry',
    'api-reference': 'section-api-reference',
    examples: 'section-examples',
  };
  return map[slug] ?? 'section-core';
}

export function Body({ children }: { children: ReactNode }) {
  const { slug = [] } = useParams<{ slug?: string[] }>();
  const section = getSection(Array.isArray(slug) ? slug[0] : undefined);

  return (
    <body className={`${section} relative flex min-h-screen flex-col font-sans`}>
      {children}
    </body>
  );
}
