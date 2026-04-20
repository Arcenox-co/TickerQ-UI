import Link from "next/link";
import { LiquidGlassLink } from "@/components/liquid-glass-button";
import { AnimatedGradientText } from "@/registry/magicui/animated-gradient-text";
import { HeroLibraryStats } from "@/components/hero-library-stats";
import { CopyInstallCommandButton } from "@/components/copy-install-command-button";
import { HeroTerminalLazy } from "@/components/hero-terminal-lazy";

const heroPrimaryCtaClassName =
  "inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-deep-navy to-space-indigo px-8 py-3.5 text-sm font-semibold text-bright-snow shadow-[0_10px_40px_-8px_hsl(225_66%_21%/0.45)] transition-[box-shadow,transform] hover:shadow-[0_14px_48px_-8px_hsl(226_66%_17%/0.55)] hover:-translate-y-0.5 active:translate-y-0";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-x-hidden">
      <div className="relative min-h-screen w-full overflow-hidden border-b border-black/[0.07] bg-cover bg-center bg-no-repeat bg-[url('/hero-light.png')] px-4 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[url('/hero-dark.png')] dark:shadow-[0_25px_80px_-24px_rgba(0,0,0,0.55)]">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/65 dark:from-neutral-950/78 dark:via-neutral-950/52 dark:to-neutral-950/68"
          aria-hidden
        />
        <div className="relative">
          <div className="p-6 sm:p-8 md:p-10 md:pb-5 ">
            <div className="text-center mt-10">
              <HeroLibraryStats />
              {/* Static H1 so LCP lands here instead of the deferred terminal animation */}
              <h1 className="text-4xl font-bold tracking-tight text-deep-navy dark:text-ghost-white sm:text-5xl md:text-6xl md:leading-[1.08]">
                <span className="inline align-baseline">Background jobs for</span>{" "}
                <AnimatedGradientText
                  speed={1.1}
                  colorFrom="hsl(217 91% 48%)"
                  colorTo="hsl(262 83% 58%)"
                  className="font-bold"
                >
                  .NET
                </AnimatedGradientText>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-blue-slate dark:text-lavender-grey md:text-lg">
                Source-generated. Native AOT ready. Zero reflection. Persist
                with EF Core or Redis and monitor everything from a real-time
                dashboard.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/docs/getting-started/quick-start"
                  className={`${heroPrimaryCtaClassName} inline-flex items-center gap-2`}
                >
                  <span>Get Started</span>
                  <svg
                    className="size-4 opacity-90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
                <LiquidGlassLink
                  href="/docs/what-is-tickerq"
                  className="rounded-full px-8 py-3.5"
                >
                  <span>Why TickerQ?</span>
                </LiquidGlassLink>
              </div>

              <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-platinum bg-ghost-white-2/95 px-3 py-2 font-mono text-sm text-deep-navy shadow-inner backdrop-blur-sm dark:border-space-indigo dark:bg-deep-navy/50 dark:text-ghost-white sm:gap-3 sm:px-5 sm:py-3">
                <span className="text-deep-navy select-none dark:text-platinum">
                  $
                </span>
                <span className="font-mono text-sm">dotnet add package TickerQ</span>
                <CopyInstallCommandButton />
              </div>
            </div>
          </div>

          <div className="relative px-0 pb-2 sm:px-2 md:px-6">
            <HeroTerminalLazy />
          </div>
        </div>
      </div>
    </section>
  );
}
