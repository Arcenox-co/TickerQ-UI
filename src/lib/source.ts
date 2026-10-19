import { commercialDocs, docs } from 'collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { docsVersions, type DocsVersion } from './docs-versions';
import { getCommercialReleases } from './github-releases';
import { releasesMarkdown } from './releases';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const commercialSource = loader({
  baseUrl: docsVersions['5.x'].baseUrl,
  source: commercialDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const documentationSources = { '5.x': commercialSource, legacy: source };
export const allDocPages = () => Object.values(documentationSources).flatMap((item) => item.getPages());

export function getDocumentation(slugs: string[] = []) {
  const version: DocsVersion = slugs[0] === '5.x' ? '5.x' : 'legacy';
  return {
    version,
    source: documentationSources[version],
    slugs: version === '5.x' ? slugs.slice(1) : slugs,
  };
}

export function getDocumentationPage(slugs: string[] = []) {
  const context = getDocumentation(slugs);
  return { ...context, page: context.source.getPage(context.slugs) };
}

export function pageRouteSegments(page: InferPageType<typeof source>) {
  return page.url.slice(`${docsRoute}/`.length).split('/').filter(Boolean);
}

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...pageRouteSegments(page), 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
  const segments = [...pageRouteSegments(page), 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  let processed = await page.data.getText('processed');
  if (page.url === '/docs/5.x/changelog') {
    const notes = releasesMarkdown(await getCommercialReleases());
    processed = processed.replace(/<ReleaseFeed\s*\/>/, () => notes);
  }

  const version = page.url === '/docs/5.x' || page.url.startsWith('/docs/5.x/') ? '5.x' : 'legacy';
  return `# ${page.data.title} (${page.url})

Documentation: ${docsVersions[version].label}. ${version === '5.x' ? 'Functional line 5.x covers 10.5.x, 9.5.x, and 8.5.x.' : 'Earlier releases; do not use these examples for the commercial 5.x line.'}

${processed}`;
}
