import { z } from 'zod';

export const releasesUrl = 'https://github.com/Arcenox-co/TickerQ/releases';
const releasesApi = 'https://api.github.com/repos/Arcenox-co/TickerQ/releases';
const pageSize = 100;
const maxPages = 5;
const displayLimit = 30;
const releaseSchema = z.object({
  id: z.number().int().positive(),
  tag_name: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  published_at: z.iso.datetime({ offset: true }).nullable(),
});
const packageVersion = /^v?((8|9|10)\.5\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?)$/;

export type Release = {
  id: number;
  tag: string;
  version: string;
  title: string;
  body: string;
  publishedAt: string;
  channel: 'Stable' | 'Beta' | 'Preview';
  url: string;
};
export type ReleaseFeedData =
  | { status: 'ready'; releases: Release[]; hasMore: boolean }
  | { status: 'unavailable' };

export function selectCommercialReleases(payload: unknown): Release[] {
  const records = z.array(releaseSchema).parse(payload);
  const selected = new Map<number, Release>();
  for (const release of records) {
    const match = packageVersion.exec(release.tag_name);
    if (release.draft || !release.published_at || !match) continue;
    const preview = release.prerelease || Boolean(match[4]);
    selected.set(release.id, {
      id: release.id,
      tag: release.tag_name,
      version: match[1],
      title: release.name?.trim() || `TickerQ ${match[1]}`,
      body: release.body?.trim() || '',
      publishedAt: release.published_at,
      channel: !preview ? 'Stable' : /(^|\.)beta(\.|$)/i.test(match[4] ?? '') ? 'Beta' : 'Preview',
      url: `${releasesUrl}/tag/${encodeURIComponent(release.tag_name)}`,
    });
  }
  return [...selected.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || b.id - a.id);
}

// Fetch only public release metadata. Never read credentials or expose drafts.
// The caller caches successful results; failures must throw to preserve that cache.
export async function fetchCommercialReleases(fetcher: typeof fetch = fetch): Promise<Extract<ReleaseFeedData, { status: 'ready' }>> {
  const records: unknown[] = [];
  const signal = AbortSignal.timeout(8000);
  let truncated = false;
  for (let page = 1; page <= maxPages; page++) {
    const response = await fetcher(`${releasesApi}?per_page=${pageSize}&page=${page}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'TickerQ-Docs', 'X-GitHub-Api-Version': '2022-11-28' },
      cache: 'no-store',
      signal,
    });
    if (!response.ok) throw new Error(`GitHub releases returned HTTP ${response.status}`);
    const data = z.array(releaseSchema).parse(await response.json());
    records.push(...data);
    if (data.length < pageSize) break;
    truncated = page === maxPages;
  }
  const releases = selectCommercialReleases(records);
  return { status: 'ready', releases: releases.slice(0, displayLimit), hasMore: truncated || releases.length > displayLimit };
}

export function releasesMarkdown(feed: ReleaseFeedData): string {
  if (feed.status === 'unavailable') return `Release notes are temporarily unavailable. [Read them on GitHub](${releasesUrl}).`;
  if (!feed.releases.length) return `${feed.hasMore ? 'No 5.x releases found in the recent release history. Check GitHub for older releases.' : 'No published 5.x releases yet.'} [Browse GitHub Releases](${releasesUrl}).`;
  return feed.releases.map(release => `### ${release.version} · ${release.channel}\n\nPublished ${new Date(release.publishedAt).toISOString().slice(0, 10)}. [View release](${release.url}).\n\n${release.body || 'No release notes were provided.'}`).join('\n\n---\n\n') + `\n\n[All releases on GitHub](${releasesUrl}).`;
}
