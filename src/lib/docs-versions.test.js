import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { docsVersionFromPath, isDocsVersion, versionDestination } from './docs-versions';

describe('documentation versions', () => {
  test('matches the exact 5.x segment, not a similar legacy path', () => {
    for (const path of ['/docs/5.x', '/docs/5.x/', '/docs/5.x/dashboard']) {
      expect(docsVersionFromPath(path)).toBe('5.x');
    }
    for (const path of ['/docs', '/docs/dashboard', '/docs/5.xyz', '/docs/5.x-old']) {
      expect(docsVersionFromPath(path)).toBe('legacy');
    }
    expect(isDocsVersion('5.x')).toBe(true);
    expect(isDocsVersion('legacy')).toBe(true);
    for (const value of ['main', '5.x/', '', null, 5, '__proto__']) expect(isDocsVersion(value)).toBe(false);
  });

  test('preserves equivalent pages and falls back when a feature is absent', () => {
    expect(versionDestination('/docs/dashboard', '5.x', ['/docs/5.x/dashboard'])).toBe('/docs/5.x/dashboard');
    expect(versionDestination('/docs/5.x/dashboard', 'legacy', ['/docs/dashboard'])).toBe('/docs/dashboard');
    expect(versionDestination('/docs/5.x/integrations', 'legacy', ['/docs', '/docs/dashboard'])).toBe('/docs');
    expect(versionDestination('/docs/examples', '5.x', ['/docs/5.x'])).toBe('/docs/5.x');
    expect(versionDestination('/docs/5.x/', 'legacy', ['/docs'])).toBe('/docs');
    expect(versionDestination('/docs/what-is-tickerq', '5.x', ['/docs/5.x/what-is-tickerq'])).toBe('/docs/5.x/what-is-tickerq');
    expect(versionDestination('/docs/5.x/what-is-tickerq', 'legacy', ['/docs/what-is-tickerq'])).toBe('/docs/what-is-tickerq');
  });
});

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

test('commercial documentation links point to existing pages in the right version', () => {
  const root = resolve(import.meta.dir, '../..');
  const commercial = resolve(root, 'content/docs-5x');
  const legacy = resolve(root, 'content/docs');
  const pages = new Set();
  for (const [dir, base] of [[commercial, '/docs/5.x'], [legacy, '/docs']]) {
    for (const file of filesIn(dir).filter(path => /\.mdx?$/.test(path))) {
      const slug = relative(dir, file).replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
      pages.add(`${base}${slug ? `/${slug}` : ''}`.replace(/\/$/, ''));
    }
  }
  const broken = [];
  for (const file of filesIn(commercial).filter(path => path.endsWith('.mdx'))) {
    const body = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
    for (const match of body.matchAll(/\]\((\/docs[^\s)#?]*)(?:[?#][^)]*)?\)/g)) {
      if (!pages.has(match[1])) broken.push(`${relative(commercial, file)}: ${match[1]}`);
    }
  }
  expect(broken).toEqual([]);
  expect(pages.has('/docs/5.x')).toBe(true);
  expect(pages.has('/docs')).toBe(true);
});
