import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-fd-border">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/2 h-[640px] w-[900px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.07),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-12 lg:py-16">
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <h1 className="text-[2.125rem] font-semibold leading-[1.14] tracking-[-0.035em] text-fd-foreground sm:text-5xl lg:text-[clamp(2.25rem,3.3vw,3rem)]">
            <span className="block">Background jobs</span>{" "}
            &amp; workflows{" "}
            <span className="whitespace-nowrap text-teal-700 dark:text-teal-400">for .NET.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-fd-muted-foreground sm:text-lg sm:leading-8">
            Schedule recurring tasks, build job chains, and monitor every run from one dashboard.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 max-[359px]:gap-2">
            <a href="https://license.tickerq.net/register" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm max-[359px]:px-3 max-[359px]:text-[13px] font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 dark:bg-teal-400 dark:text-neutral-950 dark:hover:bg-teal-300 dark:focus-visible:outline-teal-400 sm:px-5">
              Get license <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <Link href="/docs/5.x" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-sm max-[359px]:px-3 max-[359px]:text-[13px] font-medium transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 dark:focus-visible:outline-teal-400 sm:px-5">
              Read the docs <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-6 max-w-sm border-l-2 border-teal-700/20 pl-3 text-xs leading-5 text-fd-muted-foreground dark:border-teal-400/25">
            <span className="font-medium text-fd-foreground">Free Community licenses</span> for eligible companies below $5M USD in annual revenue.
            {" "}<Link href="/docs/5.x/getting-started/licensing" className="underline underline-offset-4 hover:text-fd-foreground">See eligibility</Link>
          </p>
        </div>
        <div className="mx-auto min-w-0 w-full max-w-xl lg:max-w-none"><DashboardPreview /></div>
      </div>
    </section>
  );
}
