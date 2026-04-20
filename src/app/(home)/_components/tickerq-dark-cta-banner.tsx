import Link from "next/link";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { DotPattern } from "@/components/ui/dot-pattern";
import { showcaseTextAnimate } from "./showcase-tokens";

const iconClass = "size-4";

const ArrowRightIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const BookIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const PackageIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

const GithubIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.04c-3.2.69-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export function TickerQDarkCtaBanner() {
  const ta = showcaseTextAnimate;

  return (
    <section className=" px-4 py-16 dark:border-space-indigo/60">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-space-indigo/50 bg-gradient-to-br from-deep-navy via-space-indigo to-deep-navy px-6 py-10 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.55)] md:px-10 md:py-12">
        <DotPattern
          className="pointer-events-none absolute inset-0 opacity-[0.18] text-white/90"
          width={18}
          height={18}
          cx={1}
          cy={1}
          cr={1}
          glow
        />
        <div className="relative flex flex-col min-h-40 gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
              <span className="block text-bright-snow">
                <TextAnimate {...ta} as="span" className="inline">
                  Background jobs that
                </TextAnimate>
              </span>
              <span className="mt-1 block">
                <span className="text-bright-snow">feel native to </span>
                <span className="bg-gradient-to-r from-bright-snow via-platinum to-[hsl(217_91%_82%)] bg-clip-text font-semibold text-transparent">
                  .NET
                </span>
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-platinum/95 md:text-base">
              <TextAnimate {...ta} as="span" className="inline">
                Install from NuGet, wire handlers with source generators, and
                ship with confidence — SQL, Redis, dashboards, and traces when
                you need them.
              </TextAnimate>
            </p>
          </div>
          <div className=" w-full grid grid-cols-2 gap-3   ">
            <Link
              href="/docs/getting-started/quick-start"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-bright-snow px-5 py-3.5 text-sm font-semibold text-deep-navy shadow-lg transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xl"
            >
              Quick Start
              <ArrowRightIcon />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-bright-snow backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <BookIcon />
              Documentation
            </Link>
            <a
              href="https://www.nuget.org/packages/TickerQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-bright-snow backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <PackageIcon />
              NuGet
            </a>
            <a
              href="https://github.com/arcenox-co/tickerq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-bright-snow backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <GithubIcon />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
