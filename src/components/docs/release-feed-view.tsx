import Link from 'next/link';
import { ArrowUpRight, CalendarDays, GitBranch, Tag } from 'lucide-react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { releasesUrl, type ReleaseFeedData } from '@/lib/releases';

export function ReleaseFeedView({ feed }: { feed: ReleaseFeedData }) {
  const releases = feed.status === 'ready' ? feed.releases : [];
  return (
    <div className="not-prose my-7 min-w-0">
      {releases.length === 0 ? (
        <div className="rounded-xl border border-fd-border bg-fd-secondary/40 p-6 sm:p-8">
          <Tag className="mb-4 size-5 text-fd-muted-foreground" aria-hidden />
          <h3 className="text-base font-semibold">{feed.status === 'ready' ? feed.hasMore ? 'No 5.x releases in the recent history' : 'The 5.x release history starts here' : 'Release notes are temporarily unavailable'}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-fd-muted-foreground">
            {feed.status === 'ready'
              ? feed.hasMore ? 'We found no 5.x releases in the recent GitHub history. Browse GitHub Releases to check older entries.' : 'No 5.x release has been published on GitHub yet. Published releases will appear here with their changes, release date, and upgrade notes.'
              : 'We could not load the release history. You can still read the release notes directly on GitHub.'}
          </p>
          <a href={releasesUrl} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary underline-offset-4 hover:underline">Browse GitHub Releases <ArrowUpRight className="size-4" aria-hidden /></a>
        </div>
      ) : (
        <div className="space-y-10">
          {releases.map(release => (
            <article key={release.id} id={`release-${release.id}`} aria-labelledby={`release-title-${release.id}`} className="min-w-0 scroll-mt-20 border-b border-fd-border pb-10 last:border-0">
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                <span className={`rounded-full border px-2.5 py-1 font-medium ${release.channel === 'Stable' ? 'border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-amber-600/25 bg-amber-500/10 text-amber-800 dark:text-amber-300'}`}>{release.channel}</span>
                <time dateTime={release.publishedAt} className="inline-flex items-center gap-1.5 text-fd-muted-foreground"><CalendarDays className="size-3.5" aria-hidden />{new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(release.publishedAt))}</time>
                <span className="inline-flex min-w-0 items-center gap-1.5 text-fd-muted-foreground"><GitBranch className="size-3.5 shrink-0" aria-hidden /><span className="break-all font-mono">{release.tag}</span></span>
              </div>
              <h3 id={`release-title-${release.id}`} className="text-xl font-semibold tracking-tight [overflow-wrap:anywhere]"><a href={release.url} className="hover:text-fd-primary">{release.title}</a></h3>
              <div className="mt-5 min-w-0 text-sm leading-6 [overflow-wrap:anywhere]">
                {release.body ? <ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} urlTransform={url => {
                  const safe = defaultUrlTransform(url);
                  try { return safe ? new URL(safe, `${release.url}/`).href : ''; } catch { return ''; }
                }} components={{
                  h1: ({ children }) => <h4 className="mb-2 mt-6 text-base font-semibold">{children}</h4>,
                  h2: ({ children }) => <h4 className="mb-2 mt-6 text-base font-semibold">{children}</h4>,
                  h3: ({ children }) => <h4 className="mb-2 mt-5 text-base font-semibold">{children}</h4>,
                  p: ({ children }) => <p className="my-3">{children}</p>,
                  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-5 marker:text-fd-muted-foreground">{children}</ul>,
                  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-5 marker:text-fd-muted-foreground">{children}</ol>,
                  a: ({ href, children }) => <a href={href} className="text-fd-primary underline underline-offset-4">{children}</a>,
                  pre: ({ children }) => <pre className="my-4 overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary/60 p-4 text-xs [&_code]:bg-transparent [&_code]:p-0">{children}</pre>,
                  code: ({ children }) => <code className="rounded bg-fd-secondary px-1 py-0.5 font-mono text-xs">{children}</code>,
                  table: ({ children }) => <div className="my-4 overflow-x-auto rounded-lg border border-fd-border"><table className="w-full border-collapse text-left text-xs">{children}</table></div>,
                  thead: ({ children }) => <thead className="bg-fd-secondary/60">{children}</thead>,
                  th: ({ children }) => <th className="border-b border-fd-border px-3 py-2 font-semibold">{children}</th>,
                  td: ({ children }) => <td className="border-b border-fd-border px-3 py-2">{children}</td>,
                  blockquote: ({ children }) => <blockquote className="my-4 border-l-2 border-fd-primary/40 pl-4 text-fd-muted-foreground">{children}</blockquote>,
                  hr: () => <hr className="my-6 border-fd-border" />,
                  img: ({ alt, src }) => <a href={typeof src === 'string' ? src : undefined}>{alt || 'View release image'}</a>,
                }}>{release.body}</ReactMarkdown> : <p className="text-fd-muted-foreground">No release notes were provided.</p>}
              </div>
              <a href={release.url} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline">View release on GitHub <ArrowUpRight className="size-4" aria-hidden /></a>
            </article>
          ))}
          <a href={releasesUrl} className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline">{feed.status === 'ready' && feed.hasMore ? 'More releases on GitHub' : 'All releases on GitHub'} <ArrowUpRight className="size-4" aria-hidden /></a>
        </div>
      )}
      <p className="mt-6 text-xs leading-5 text-fd-muted-foreground">Looking for an earlier version? Browse the <Link href="/docs/releases" className="underline underline-offset-4 hover:text-fd-foreground">legacy release notes</Link>.</p>
    </div>
  );
}
