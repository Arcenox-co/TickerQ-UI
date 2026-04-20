import type { SVGProps } from "react";
import { Check, Package } from "iconoir-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { borderBeamNeutral } from "./showcase-tokens";

type TierKind = "core" | "dashboard" | "stack";

/** Filled glyphs (Heroicons-style paths) — solid weight, brand color on white */
function TierMark({
  tier,
  className,
}: {
  tier: TierKind;
} & SVGProps<SVGSVGElement>) {
  /** Lucide `layers` (stacked planes) for full-stack / modular packages; Heroicons-style fills for other tiers. */
  const paths: Record<TierKind, string | readonly string[]> = {
    core: "M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.692 0-5.216-.584-7.499-1.632a.75.75 0 0 1-.437-.695Z",
    dashboard:
      "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z",
    stack: [
      "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
    ],
  };
  const d = paths[tier];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {typeof d === "string" ? (
        <path fillRule="evenodd" d={d} clipRule="evenodd" />
      ) : (
        d.map((p, i) => <path key={i} d={p} />)
      )}
    </svg>
  );
}

const checklistItems = [
  "Second-level cron precision for recurring work",
  "Per-function concurrency, priorities, and throttling",
  "Persist with EF Core or Redis — same abstractions",
  "Real-time dashboard with Vue.js and SignalR",
  "OpenTelemetry spans and structured logging",
  "Source-generated handlers — Native AOT friendly",
] as const;

const tierCards: {
  tier: TierKind;
  title: string;
  subtitle: string;
  /** Large accent (e.g. price or tier label). */
  highlight: string;
  /** Smaller trailing text on the same line. */
  rest: string;
}[] = [
  {
    tier: "core",
    title: "Core",
    subtitle: "Scheduler + source generator",
    highlight: "$0",
    rest: "on NuGet",
  },
  {
    tier: "dashboard",
    title: "Dashboard",
    subtitle: "Live monitoring & control plane",
    highlight: "Add-on",
    rest: "package",
  },
  {
    tier: "stack",
    title: "Full stack",
    subtitle: "Persistence, Redis, OTel — as needed",
    highlight: "Modular",
    rest: "NuGet line-up",
  },
];

export function TickerQCapabilitiesSplit() {
  return (
    <section className="px-4 py-16 dark:border-space-indigo/60">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-platinum bg-ghost-white-2 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.18)] dark:border-space-indigo/60 dark:bg-deep-navy/35">
        <DotPattern
          className="pointer-events-none absolute -right-px top-0 h-full w-[45%] text-brand/25 [mask-image:linear-gradient(to_left,black,transparent)] dark:text-brand/20"
          width={14}
          height={14}
          cx={1}
          cy={1}
          cr={1}
        />
        <div className="relative grid gap-10 p-8 md:grid-cols-2 md:gap-12 md:p-12">
          <BlurFade inView offset={12}>
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-platinum bg-white/90 px-3 py-1 text-xs font-semibold text-deep-navy shadow-sm dark:border-space-indigo dark:bg-space-indigo/40 dark:text-ghost-white">
                <Package className="size-3.5 text-brand" strokeWidth={2} />
                TickerQ
              </div>
              <h2 className="text-balance text-2xl font-bold tracking-tight text-deep-navy dark:text-ghost-white md:text-3xl">
                Start on NuGet, scale with packages you need
              </h2>
              <ul className="mt-6 space-y-3">
                {checklistItems.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-sm leading-relaxed text-blue-slate dark:text-lavender-grey"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand dark:bg-brand/20">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>

          <div className="flex flex-col gap-4">
            {tierCards.map((tier, i) => (
              <BlurFade key={tier.title} inView delay={0.06 * i} offset={10}>
                <div className="relative overflow-hidden rounded-2xl">
                  <BorderBeam
                    size={60}
                    duration={12}
                    delay={i * 0.35}
                    colorFrom={borderBeamNeutral.colorFrom}
                    colorTo={borderBeamNeutral.colorTo}
                    borderWidth={1.5}
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-platinum/55 bg-white shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_18px_42px_-22px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.035] dark:border-white/12 dark:bg-white dark:shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_22px_56px_-28px_rgba(0,0,0,0.55)] dark:ring-white/12">
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 z-1 h-px bg-linear-to-r from-transparent via-platinum/70 to-transparent dark:via-white/25"
                      aria-hidden
                    />
                    <div className="relative flex items-center justify-between gap-5 p-6 sm:p-7 md:p-8">
                      <div className="flex min-w-0 items-center gap-4">
                        <TierMark
                          tier={tier.tier}
                          className="size-8 shrink-0 text-brand"
                        />
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold tracking-tight text-deep-navy">
                            {tier.title}
                          </p>
                          <p className="mt-0.5 text-xs leading-snug text-blue-slate">
                            {tier.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium text-deep-navy">
                          <span className="text-lg font-bold tabular-nums tracking-tight">
                            {tier.highlight}
                          </span>
                          {tier.rest ? (
                            <span className="ml-1 text-xs font-medium text-blue-slate">
                              {tier.rest}
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
