import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Package, ShieldCheck } from 'lucide-react';
import { HomeHeroSection } from './_components/home-hero';
import { WorkflowExample } from './_components/workflow-example';
import { HomeCapabilities } from './_components/home-capabilities';
import { HomeFaq } from './_components/home-faq';
import { SiteFooter } from '@/components/landing/site-footer';
import { getCommercialReleases } from '@/lib/github-releases';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'TickerQ — Background jobs, workflows, and monitoring for .NET',
  description: 'Schedule .NET jobs, build recurring workflows, and monitor every run with TickerQ. Self-hosted dashboard, EF Core, MongoDB, Redis, and Slack or Teams alerts. Free Community licenses for eligible organizations.',
  alternates: { canonical: '/' },
};

const linkStyle = 'inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline dark:text-teal-400';

export default async function HomePage() {
  const feed = await getCommercialReleases();
  const latest = feed.status === 'ready' ? feed.releases[0] : undefined;
  return (
    <>
      <HomeHeroSection />
      <WorkflowExample />

      <HomeCapabilities />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="storage-heading">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">Fits your application</p>
            <h2 id="storage-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your .NET host.<br />Your infrastructure.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-fd-muted-foreground">Bring your services and dependency injection. Start in memory for development, then choose persistent storage for jobs that need to survive restarts.</p>
            <Link href="/docs/5.x/getting-started/quick-start" className={`${linkStyle} mt-6`}>Run your first job <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <div className="divide-y divide-fd-border border-y border-fd-border">
            {[
              { title: 'Entity Framework Core', text: 'SQL Server, PostgreSQL, MySQL, MariaDB, Oracle, SQLite, CockroachDB, and YugabyteDB', href: '/docs/5.x/entity-framework' },
              { title: 'MongoDB', text: 'Document-based operational storage', href: '/docs/5.x/mongodb' },
              { title: 'Redis', text: 'Operational storage and optional caching', href: '/docs/5.x/redis' },
              { title: 'OpenTelemetry', text: 'Execution traces and runtime metrics', href: '/docs/5.x/opentelemetry' },
            ].map(item => <Link key={item.title} href={item.href} className="group flex items-center justify-between gap-4 py-4"><div><h3 className="font-semibold group-hover:text-teal-700 dark:group-hover:text-teal-400">{item.title}</h3><p className="mt-1 text-sm text-fd-muted-foreground">{item.text}</p></div><ArrowUpRight className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden /></Link>)}
          </div>
        </div>
      </section>

      <section id="licensing" className="border-y border-fd-border bg-teal-500/5" aria-labelledby="license-heading">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">Start with the license that fits</p>
          <div className="mt-5 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div>
              <h2 id="license-heading" className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Free for eligible companies<br className="hidden sm:block" /> under $5M.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-fd-muted-foreground">Community is free for eligible companies with consolidated annual gross revenue below $5M USD. Eligible individuals, nonprofits, and educational users can qualify too.</p>
              <a href="https://license.tickerq.net/register" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-neutral-950 dark:hover:bg-teal-300">Get a free Community license <ArrowRight className="size-4" aria-hidden /></a>
            </div>
            <div className="border-t border-teal-700/20 pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-1">
              <ShieldCheck className="size-6 text-teal-700 dark:text-teal-400" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">Plans for larger organizations.</h3>
              <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">Paid subscriptions cover organizations that do not qualify for Community, including companies at or above $5M USD.</p>
              <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">Evaluating a fit? A one-time 30-day Evaluation is available for internal, non-production use under the agreement.</p>
              <a href="https://license.tickerq.net/pricing" className={`${linkStyle} mt-5`}>Compare plans <ArrowUpRight className="size-4" aria-hidden /></a>
            </div>
          </div>
          <p className="mt-9 border-t border-teal-700/15 pt-5 text-xs leading-5 text-fd-muted-foreground">5.x is source-available under the TickerQ Software License Agreement. Eligibility includes control-group and revenue definitions and is reassessed annually. <Link href="/docs/5.x/getting-started/licensing" className="underline underline-offset-4 hover:text-fd-foreground">Read the licensing guide.</Link></p>
        </div>
      </section>

      <HomeFaq />

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20" aria-labelledby="next-step-heading">
        <div className="grid gap-6 rounded-xl border border-fd-border bg-fd-muted/25 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-3"><Package className="mt-1 size-5 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden /><div>
            <h2 id="next-step-heading" className="font-semibold">{latest ? `Latest 5.x release: ${latest.version}` : feed.status === 'ready' ? 'Explore the 5.x preview' : 'Follow TickerQ releases'}</h2>
            <p className="mt-1.5 text-sm leading-6 text-fd-muted-foreground">{latest ? `${latest.channel} · Published ${new Date(latest.publishedAt).toISOString().slice(0, 10)}. Review changes and upgrade notes before updating.` : 'Find release notes and upgrade guidance in the changelog.'}</p>
          </div></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3"><Link href="/docs/5.x/changelog" className={linkStyle}>Changelog <ArrowUpRight className="size-4" aria-hidden /></Link><Link href="/docs/5.x/getting-started/migration" className={linkStyle}>Upgrade guide <ArrowUpRight className="size-4" aria-hidden /></Link></div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
