import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReleaseFeedView } from '../components/docs/release-feed-view';
import { fetchCommercialReleases, releasesMarkdown, releasesUrl, selectCommercialReleases } from './releases';

// Synthetic API fixtures: never published or sent to GitHub.
function release(overrides = {}) {
  return {
    id: 101,
    tag_name: 'v10.5.2',
    name: 'Scheduling fixes',
    body: '## Fixes\n\n- Scheduled jobs retain their execution time.',
    draft: false,
    prerelease: false,
    published_at: '2026-10-19T10:30:00Z',
    ...overrides,
  };
}

function response(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } });
}

function pagedFetcher(pages) {
  const calls = [];
  return {
    calls,
    fetcher: async (input, options) => {
      calls.push({ url: new URL(input), options });
      const page = Number(new URL(input).searchParams.get('page'));
      if (!pages[page - 1]) throw new Error(`Unexpected request for page ${page}`);
      return response(pages[page - 1]);
    },
  };
}

function ready(records, hasMore = false) {
  return { status: 'ready', releases: selectCommercialReleases(records), hasMore };
}

function render(feed) {
  return renderToStaticMarkup(createElement(ReleaseFeedView, { feed }));
}

describe('commercial release selection', () => {
  test('includes only published commercial package lines, excluding drafts and legacy tags', () => {
    const records = [
      release({ id: 1, tag_name: 'v8.5.1' }),
      release({ id: 2, tag_name: '9.5.3' }),
      release({ id: 3, tag_name: '10.5.2' }),
      release({ id: 4, tag_name: '10.5.4', draft: true }),
      release({ id: 5, tag_name: '10.5.5', published_at: null }),
      ...['10.4.9', 'v10.6.0', '5.0.0', '18.5.0', 'release-10.5.0', '10.5.01', '10.5.2-extra!'].map((tag_name, i) => release({ id: 10 + i, tag_name })),
    ];
    expect(selectCommercialReleases(records).map(item => item.tag)).toEqual(['10.5.2', '9.5.3', 'v8.5.1']);
  });

  test('preserves the exact published version and never invents companion target releases', () => {
    const selected = selectCommercialReleases([release({ tag_name: 'v10.5.2-beta.3+build.6' })]);
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      tag: 'v10.5.2-beta.3+build.6',
      version: '10.5.2-beta.3+build.6',
      url: `${releasesUrl}/tag/v10.5.2-beta.3%2Bbuild.6`,
    });
    expect(selected.some(item => item.version.startsWith('8.') || item.version.startsWith('9.'))).toBe(false);
  });

  test('sorts newest published dates first, with deterministic order for equal dates', () => {
    const selected = selectCommercialReleases([
      release({ id: 1, tag_name: '10.5.50', published_at: '2026-10-01T00:00:00Z' }),
      release({ id: 2, tag_name: '8.5.1', published_at: '2026-10-19T11:00:00+01:00' }),
      release({ id: 3, tag_name: '9.5.1', published_at: '2026-10-19T10:00:00Z' }),
    ]);
    expect(selected.map(item => item.id)).toEqual([3, 2, 1]);
  });

  test('does not repeat a release encountered on overlapping API pages', () => {
    const selected = selectCommercialReleases([release(), release({ body: 'Corrected notes' })]);
    expect(selected).toHaveLength(1);
    expect(selected[0].body).toBe('Corrected notes');
  });

  test('distinguishes stable, beta, and other previews even if GitHub prerelease flag was omitted', () => {
    const cases = [
      ['10.5.1', false, 'Stable'],
      ['10.5.1+build.1', false, 'Stable'],
      ['10.5.1-beta', true, 'Beta'],
      ['10.5.1-beta.2', false, 'Beta'],
      ['10.5.1-BETA.2', false, 'Beta'],
      ['10.5.1-rc.1', false, 'Preview'],
      ['10.5.1-alpha.1', true, 'Preview'],
      ['10.5.1', true, 'Preview'],
    ];
    for (const [tag_name, prerelease, channel] of cases) {
      expect(selectCommercialReleases([release({ tag_name, prerelease })])[0].channel).toBe(channel);
    }
  });

  test('handles missing display text without guessing release notes', () => {
    expect(selectCommercialReleases([release({ name: null, body: null })])[0]).toMatchObject({ title: 'TickerQ 10.5.2', body: '' });
    expect(selectCommercialReleases([release({ name: '  ', body: '  \n ' })])[0]).toMatchObject({ title: 'TickerQ 10.5.2', body: '' });
    expect(selectCommercialReleases([release({ name: '  Fixed scheduler  ', body: '  Revised notes  ' })])[0]).toMatchObject({ title: 'Fixed scheduler', body: 'Revised notes' });
  });

  test('rejects malformed API payloads instead of reporting no releases', () => {
    for (const payload of [{ message: 'API rate limit exceeded' }, null, [release({ id: -1 })], [release({ published_at: 'not-a-date' })], [release({ prerelease: 'false' })]]) {
      expect(() => selectCommercialReleases(payload)).toThrow();
    }
  });
});

describe('GitHub release fetching', () => {
  test('returns a genuine empty feed and stops after an empty first page', async () => {
    const { fetcher, calls } = pagedFetcher([[]]);
    expect(await fetchCommercialReleases(fetcher)).toEqual({ status: 'ready', releases: [], hasMore: false });
    expect(calls).toHaveLength(1);
    expect(calls[0].url.origin).toBe('https://api.github.com');
    expect(calls[0].url.pathname).toBe('/repos/Arcenox-co/TickerQ/releases');
    expect(calls[0].options.headers.Authorization).toBeUndefined();
    expect(calls[0].options.signal).toBeInstanceOf(AbortSignal);
  });

  test('continues past a full legacy page to find commercial releases', async () => {
    const legacy = Array.from({ length: 100 }, (_, i) => release({ id: i + 1, tag_name: `10.4.${i}` }));
    const { fetcher, calls } = pagedFetcher([legacy, [release({ id: 101 })]]);
    const feed = await fetchCommercialReleases(fetcher);
    expect(feed.releases.map(item => item.id)).toEqual([101]);
    expect(feed.hasMore).toBe(false);
    expect(calls.map(item => item.url.searchParams.get('page'))).toEqual(['1', '2']);
    expect(calls.every(item => item.url.searchParams.get('per_page') === '100')).toBe(true);
    expect(calls[0].options.signal).toBe(calls[1].options.signal);
  });

  test('limits rendered releases and signals that more published entries exist', async () => {
    const records = Array.from({ length: 31 }, (_, i) => release({ id: i + 1, tag_name: `10.5.${i}` }));
    const { fetcher } = pagedFetcher([records]);
    const feed = await fetchCommercialReleases(fetcher);
    expect(feed.releases).toHaveLength(30);
    expect(feed.releases[0].id).toBe(31);
    expect(feed.hasMore).toBe(true);
  });

  test('bounds pagination rather than walking arbitrary release history', async () => {
    const pages = Array.from({ length: 5 }, (_, page) => Array.from({ length: 100 }, (_, i) => release({ id: page * 100 + i + 1, tag_name: `10.5.${page * 100 + i}` })));
    const { fetcher, calls } = pagedFetcher(pages);
    const feed = await fetchCommercialReleases(fetcher);
    expect(calls).toHaveLength(5);
    expect(feed.releases).toHaveLength(30);
    expect(feed.hasMore).toBe(true);
  });

  test('propagates HTTP and network failures so a cache can retain the previous successful data', async () => {
    await expect(fetchCommercialReleases(async () => response({ message: 'API rate limit exceeded' }, 403))).rejects.toThrow('HTTP 403');
    await expect(fetchCommercialReleases(async () => { throw new Error('Connection unavailable'); })).rejects.toThrow('Connection unavailable');
  });

  test('rejects malformed later pages instead of returning a misleading partial success', async () => {
    const first = Array.from({ length: 100 }, (_, i) => release({ id: i + 1 }));
    const { fetcher } = pagedFetcher([first, { message: 'Unexpected API payload' }]);
    await expect(fetchCommercialReleases(fetcher)).rejects.toThrow();
  });
});

describe('release feed rendering and exports', () => {
  test('renders real Markdown tables, links, metadata, and accessible release headings', () => {
    const body = '## Upgrade\n\n| Package | Version |\n| --- | --- |\n| TickerQ | 10.5.2 |\n\n[Migration guide](https://tickerq.net/docs/5.x/guides/storage-upgrade)';
    const html = render(ready([release({ body })]));
    expect(html).toMatch(/<table\b[^>]*>/);
    expect(html).toMatch(/<th\b[^>]*>Package<\/th>/);
    expect(html).toContain('href="https://tickerq.net/docs/5.x/guides/storage-upgrade"');
    expect(html).toContain('aria-labelledby="release-title-101"');
    expect(html).toContain('id="release-title-101"');
    expect(html).toContain('dateTime="2026-10-19T10:30:00Z"');
    expect(html).toContain('Oct 19, 2026');
    expect(html).toContain('>Stable</span>');
    expect(html).toContain('>Upgrade</h4>');
  });

  test('does not execute release HTML, unsafe links, or load remote images', () => {
    const body = '<script>window.__releaseInjected = true;</script>\n\n<img src="https://tracker.invalid/pixel" onerror="alert(1)" />\n\n[Unsafe](javascript:alert%281%29)\n\n![Release image](https://images.example.com/preview.png)';
    const html = render(ready([release({ name: '<script>not executable</script>', body })]));
    expect(html).not.toContain('<script');
    expect(html).not.toContain('window.__releaseInjected');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('onerror=');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('tracker.invalid');
    expect(html).toContain('&lt;script&gt;not executable&lt;/script&gt;');
    expect(html).toContain('href="https://images.example.com/preview.png"');
    expect(html).toContain('>Release image</a>');
  });

  test('resolves relative release links against GitHub, never the documentation origin', () => {
    const html = render(ready([release({ body: '[Compare](/Arcenox-co/TickerQ/compare/a...b)' })]));
    expect(html).toContain('href="https://github.com/Arcenox-co/TickerQ/compare/a...b"');
  });

  test('distinguishes empty history from unavailable history and provides useful fallback links', () => {
    const empty = render(ready([]));
    const unavailable = render({ status: 'unavailable' });
    expect(empty).toContain('The 5.x release history starts here');
    expect(empty).not.toContain('could not load');
    expect(unavailable).toContain('Release notes are temporarily unavailable');
    expect(unavailable).not.toContain('No 5.x release has been published');
    for (const html of [empty, unavailable]) {
      expect(html).toContain(`href="${releasesUrl}"`);
      expect(html).toContain('href="/docs/releases"');
    }
  });

  test('explains missing release bodies and links to additional history', () => {
    const html = render(ready([release({ body: null })], true));
    expect(html).toContain('No release notes were provided.');
    expect(html).toContain('More releases on GitHub');
  });

  test('exports the published version, channel, UTC date, body, and release link accurately', () => {
    const feed = ready([release({ tag_name: '9.5.1-beta.2', body: '## Fixes\n\n- Preserve state after restart.' })]);
    const markdown = releasesMarkdown(feed);
    expect(markdown).toContain('### 9.5.1-beta.2 · Beta');
    expect(markdown).toContain('Published 2026-10-19.');
    expect(markdown).toContain(`[View release](${feed.releases[0].url})`);
    expect(markdown).toContain('## Fixes\n\n- Preserve state after restart.');
    expect(markdown).not.toContain('10.5.1');
    expect(markdown).not.toContain('8.5.1');
  });

  test('exports the same UTC publication date as the visible release metadata', () => {
    const feed = ready([release({ published_at: '2026-10-20T00:30:00+01:00' })]);
    expect(render(feed)).toContain('Oct 19, 2026');
    expect(releasesMarkdown(feed)).toContain('Published 2026-10-19.');
  });

  test('does not claim no releases exist when bounded history contains no matches', () => {
    const feed = ready([], true);
    const html = render(feed);
    const markdown = releasesMarkdown(feed);
    expect(html).not.toContain('No 5.x release has been published on GitHub yet.');
    expect(markdown).not.toContain('No published 5.x releases yet.');
    expect(html).toContain(`href="${releasesUrl}"`);
    expect(markdown).toContain(releasesUrl);
  });

  test('Markdown fallback text retains empty/unavailable distinction and never invents notes', () => {
    expect(releasesMarkdown(ready([]))).toContain('No published 5.x releases yet.');
    expect(releasesMarkdown({ status: 'unavailable' })).toContain('Release notes are temporarily unavailable.');
    expect(releasesMarkdown({ status: 'unavailable' })).not.toContain('No published');
    expect(releasesMarkdown(ready([release({ body: '' })]))).toContain('No release notes were provided.');
    expect(releasesMarkdown({ status: 'unavailable' })).toContain(releasesUrl);
  });
});
