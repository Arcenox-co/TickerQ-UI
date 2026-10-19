import { expect, test } from 'bun:test';
import { NextRequest } from 'next/server';
import proxy from './proxy';

for (const path of ['/docs/5.x', '/docs/dashboard']) {
  test(`serves a Markdown representation for ${path}`, () => {
    const response = proxy(new NextRequest(`https://tickerq.net${path}`, {
      headers: { Accept: 'text/markdown' },
    }));
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      `https://tickerq.net/llms.mdx${path}/content.md`,
    );
    expect(response.headers.get('vary')).toContain('Accept');
  });
}

test('explicit MDX suffix is rewritten without Accept negotiation', () => {
  const response = proxy(new NextRequest('https://tickerq.net/docs/5.x/dashboard.mdx'));
  expect(response.headers.get('x-middleware-rewrite')).toBe(
    'https://tickerq.net/llms.mdx/docs/5.x/dashboard/content.md',
  );
});

test('ordinary browser requests keep their HTML page', () => {
  const response = proxy(new NextRequest('https://tickerq.net/docs/5.x', {
    headers: { Accept: 'text/html,application/xhtml+xml' },
  }));
  expect(response.headers.get('x-middleware-rewrite')).toBeNull();
});
