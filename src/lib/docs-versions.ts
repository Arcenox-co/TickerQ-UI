export const docsVersions = {
  '5.x': {
    label: '5.x · Commercial',
    baseUrl: '/docs/5.x',
    contentDir: 'content/docs-5x',
  },
  legacy: {
    label: 'Legacy · Open-source releases',
    baseUrl: '/docs',
    contentDir: 'content/docs',
  },
} as const;

export type DocsVersion = keyof typeof docsVersions;

export function isDocsVersion(value: unknown): value is DocsVersion {
  return value === '5.x' || value === 'legacy';
}

export function docsVersionFromPath(path: string): DocsVersion {
  return path === '/docs/5.x' || path.startsWith('/docs/5.x/') ? '5.x' : 'legacy';
}

export function versionDestination(path: string, target: DocsVersion, availableUrls: readonly string[]): string {
  const current = docsVersionFromPath(path);
  const suffix = path.slice(docsVersions[current].baseUrl.length).replace(/\/$/, '');
  const candidate = `${docsVersions[target].baseUrl}${suffix}`;
  return availableUrls.includes(candidate) ? candidate : docsVersions[target].baseUrl;
}
