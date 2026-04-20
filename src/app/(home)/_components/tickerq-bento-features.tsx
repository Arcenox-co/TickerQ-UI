import type { ComponentType, CSSProperties, SVGProps } from "react";
import {
  Activity,
  Clock,
  Code,
  Community,
  Database,
  Filter,
  Flash,
  GitBranch,
  Package,
  Refresh,
  ShieldCheck,
  Sort,
  Spark,
  Star,
  SwitchOn,
  ViewGrid,
} from "iconoir-react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import { bentoCardTitleClass, borderBeamNeutral } from "./showcase-tokens";

type IconProps = SVGProps<SVGSVGElement>;

/** Four strips: different copy, speeds, directions */
const SCHEDULING_MARQUEE_ROWS: {
  pills: readonly string[];
  durationSec: number;
  reverse: boolean;
}[] = [
  {
    pills: [
      "dotnet add package TickerQ",
      "dotnet add package TickerQ.Dashboard",
      "dotnet restore",
      "dotnet build -c Release",
      "dotnet test --no-build",
    ],
    durationSec: 26,
    reverse: false,
  },
  {
    pills: ["0 9 * * *", "*/30 * * * * *", "0 0 * * 0", "0 0 1 * *", "@daily"],
    durationSec: 34,
    reverse: true,
  },
  {
    pills: [
      '[TickerFunction("email-digest")]',
      "await timeTicker.AddAsync(",
      "new TimeTickerEntity",
      "TickerFunctionContext ctx",
      "CancellationToken ct",
    ],
    durationSec: 22,
    reverse: false,
  },
  {
    pills: [
      "TickerQ.EntityFrameworkCore",
      "TickerQ.Caching.StackExchangeRedis",
      "TickerQ.Instrumentation.OpenTelemetry",
      "services.AddTickerQ(",
      "UseTickerQ()",
    ],
    durationSec: 40,
    reverse: true,
  },
];

function ExpressiveSchedulingMarquees() {
  return (
    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-platinum/80 bg-ghost-white-2/80 py-2 dark:border-space-indigo/60 dark:bg-space-indigo/25">
      {SCHEDULING_MARQUEE_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full min-w-0 overflow-hidden py-0.5">
          <Marquee
            pauseOnHover
            reverse={row.reverse}
            className="p-0.5 [--gap:0.28rem]"
            style={
              {
                "--duration": `${row.durationSec}s`,
              } as CSSProperties
            }
          >
            {row.pills.map((pill, i) => (
              <span
                key={`sched-${rowIndex}-${i}`}
                className="mx-0.5 inline-flex shrink-0 whitespace-nowrap rounded-md border border-platinum bg-white px-2.5 py-1.5 font-mono text-[10px] leading-tight text-deep-navy shadow-sm dark:border-space-indigo dark:bg-deep-navy/80 dark:text-ghost-white sm:px-2 sm:text-[11px]"
              >
                {pill}
              </span>
            ))}
          </Marquee>
        </div>
      ))}
    </div>
  );
}

const pipelineSteps: {
  icon: typeof Clock;
  label: string;
}[] = [
  { icon: Clock, label: "Schedule or enqueue work" },
  { icon: Community, label: "Respect concurrency & priorities" },
  { icon: Package, label: "Persist state to SQL or Redis" },
  { icon: ShieldCheck, label: "Retries, chains, and telemetry" },
];

const marqueeIcons = [
  Clock,
  Community,
  Package,
  Spark,
  Star,
  ShieldCheck,
] as const;

/** Second row — stack / product surface (distinct from first row) */
const marqueeIconsRowB = [
  Database,
  Activity,
  Flash,
  ViewGrid,
  GitBranch,
  Code,
] as const;

const productionWorkloadFeatures: {
  icon: ComponentType<IconProps>;
  title: string;
  description: string;
}[] = [
  {
    icon: Clock,
    title: "Second-Level Cron",
    description: "Precision scheduling beyond the standard minute granularity",
  },
  {
    icon: Community,
    title: "Per-Function Concurrency",
    description: "Control how many instances of each job run simultaneously",
  },
  {
    icon: Sort,
    title: "Job Priorities",
    description:
      "Low, Normal, High, Critical — jobs execute in the right order",
  },
  {
    icon: Refresh,
    title: "Configurable Retries",
    description: "Set max attempts and let TickerQ handle transient failures",
  },
  {
    icon: Filter,
    title: "Throttling",
    description: "Rate-limit job execution to protect downstream services",
  },
  {
    icon: GitBranch,
    title: "Job Chaining",
    description: "Parent-child workflows for complex orchestration pipelines",
  },
  {
    icon: SwitchOn,
    title: "Runtime Toggle",
    description: "Enable or disable individual cron jobs without redeployment",
  },
  {
    icon: Code,
    title: "Typed Context",
    description:
      "Strongly-typed TickerFunctionContext with request deserialization",
  },
];

/** Bento deep-dives — indices into `productionWorkloadFeatures` */
const bentoThroughputHighlights = [
  productionWorkloadFeatures[1],
  productionWorkloadFeatures[2],
  productionWorkloadFeatures[4],
] as const;

const bentoResilienceHighlights = [
  productionWorkloadFeatures[3],
  productionWorkloadFeatures[5],
  productionWorkloadFeatures[6],
  productionWorkloadFeatures[7],
] as const;

export function TickerQBentoFeatures() {
  return (
    <section className=" px-4 py-20 dark:border-space-indigo/60">
      <div className="mx-auto max-w-5xl">
        <BlurFade inView className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-platinum bg-ghost-white-2 px-3 py-1 text-xs font-semibold text-deep-navy dark:border-space-indigo dark:bg-deep-navy/50 dark:text-ghost-white">
            <Spark className="size-3.5 text-brand" strokeWidth={2} />
            Features
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-slate dark:text-lavender-grey">
            Built for production workloads
          </p>
          <h2 className="text-balance text-2xl font-bold tracking-tight text-deep-navy dark:text-ghost-white md:text-3xl">
            One scheduler, every production concern
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-blue-slate dark:text-lavender-grey md:text-base">
            Every feature you need for reliable job scheduling, built into a
            zero-dependency core. From cron expressions to dashboards —
            composable packages, no reflection-heavy magic.
          </p>
        </BlurFade>

        <div className="grid gap-4 md:grid-cols-2">
          <BlurFade inView delay={0.05} offset={12}>
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl border border-platinum bg-white/90 p-6 sm:p-7 md:p-8 dark:border-space-indigo dark:bg-deep-navy/45">
              <h3 className={bentoCardTitleClass}>Expressive scheduling</h3>
              <p className="mt-1 text-sm text-blue-slate dark:text-lavender-grey">
                Cron, one-off runs, and strongly typed handlers in plain C#.
              </p>
              <ExpressiveSchedulingMarquees />
            </div>
          </BlurFade>

          <BlurFade inView delay={0.08} offset={12}>
            <div className="relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-platinum bg-white/90 p-6 sm:p-7 md:p-8 dark:border-space-indigo dark:bg-deep-navy/45">
              <BorderBeam
                size={80}
                duration={14}
                colorFrom={borderBeamNeutral.colorFrom}
                colorTo={borderBeamNeutral.colorTo}
                borderWidth={1.5}
              />
              <h3 className={bentoCardTitleClass}>End-to-end pipeline</h3>
              <p className="mt-1 text-sm text-blue-slate dark:text-lavender-grey">
                How a job moves from schedule to completion.
              </p>
              <ul className="relative mt-5 space-y-3">
                {pipelineSteps.map((step) => (
                  <li
                    key={step.label}
                    className="flex items-center gap-3 text-sm text-deep-navy dark:text-ghost-white"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand/12 text-brand dark:bg-brand/18">
                      <step.icon className="size-4" strokeWidth={1.75} />
                    </span>
                    {step.label}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1} offset={12}>
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl border border-platinum bg-white/90 p-6 sm:p-7 md:p-8 dark:border-space-indigo dark:bg-deep-navy/45">
              <AnimatedGridPattern
                className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
                width={36}
                height={36}
                numSquares={28}
                maxOpacity={0.35}
                duration={3}
                repeatDelay={0.6}
              />
              <div className="relative">
                <h3 className={bentoCardTitleClass}>Ecosystem</h3>
                <p className="mt-1 text-sm text-blue-slate dark:text-lavender-grey">
                  Add Redis, EF Core, OpenTelemetry, and more as separate
                  packages.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <div className="w-full min-w-0 overflow-hidden py-0.5">
                    <Marquee
                      pauseOnHover
                      className="w-full [--gap:0.35rem]"
                      style={{ "--duration": "32s" } as CSSProperties}
                    >
                      {marqueeIcons.map((Icon, idx) => (
                        <span
                          key={`eco-a-${idx}`}
                          className="mx-1 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-platinum bg-white/95 text-brand shadow-sm dark:border-space-indigo dark:bg-deep-navy/90"
                        >
                          <Icon className="size-5" strokeWidth={1.75} />
                        </span>
                      ))}
                    </Marquee>
                  </div>
                  <div className="w-full min-w-0 overflow-hidden py-0.5">
                    <Marquee
                      pauseOnHover
                      reverse
                      className="w-full [--gap:0.35rem]"
                      style={{ "--duration": "38s" } as CSSProperties}
                    >
                      {marqueeIconsRowB.map((Icon, idx) => (
                        <span
                          key={`eco-b-${idx}`}
                          className="mx-1 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-platinum bg-white/95 text-brand shadow-sm dark:border-space-indigo dark:bg-deep-navy/90"
                        >
                          <Icon className="size-5" strokeWidth={1.75} />
                        </span>
                      ))}
                    </Marquee>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.12} offset={12}>
            <div className="relative flex h-full min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-platinum bg-gradient-to-b from-ghost-white-2 to-white p-7 sm:p-8 md:p-9 dark:border-space-indigo dark:from-deep-navy/80 dark:to-deep-navy/40">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                aria-hidden
                style={{
                  backgroundImage: `radial-gradient(circle at center, color-mix(in srgb, var(--color-brand) 25%, transparent) 0%, transparent 55%)`,
                }}
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative flex size-28 items-center justify-center">
                  <span
                    className="absolute size-28 rounded-full border border-dashed border-brand/35"
                    aria-hidden
                  />
                  <span
                    className="absolute size-[5.5rem] rounded-full border border-brand/20"
                    aria-hidden
                  />
                  <span
                    className="absolute size-16 rounded-full bg-brand/15 dark:bg-brand/25"
                    aria-hidden
                  />
                  <ShieldCheck
                    className="relative size-10 text-brand"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className={`mt-5 ${bentoCardTitleClass}`}>
                  Production defaults
                </h3>
                <p className="mt-1 max-w-xs text-sm text-blue-slate dark:text-lavender-grey">
                  Retries, throttling, and runtime toggles without bolting on
                  another framework.
                </p>
              </div>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.14} offset={12}>
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl border border-platinum bg-white/90 p-6 sm:p-7 md:p-8 dark:border-space-indigo dark:bg-deep-navy/45">
              <h3 className={bentoCardTitleClass}>Throughput & fairness</h3>
              <p className="mt-1 text-sm text-blue-slate dark:text-lavender-grey">
                Concurrency caps, priority lanes, and throttling so loud jobs
                cannot starve the rest of the system.
              </p>
              <ul className="relative mt-5 space-y-4">
                {bentoThroughputHighlights.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 text-sm text-deep-navy dark:text-ghost-white"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand dark:bg-brand/18">
                      <item.icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-blue-slate dark:text-lavender-grey">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.16} offset={12}>
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl border border-platinum bg-white/90 p-6 sm:p-7 md:p-8 dark:border-space-indigo dark:bg-deep-navy/45">
              <BorderBeam
                size={72}
                duration={15}
                delay={0.35}
                colorFrom={borderBeamNeutral.colorFrom}
                colorTo={borderBeamNeutral.colorTo}
                borderWidth={1.5}
              />
              <h3 className={bentoCardTitleClass}>Resilience & control</h3>
              <p className="mt-1 text-sm text-blue-slate dark:text-lavender-grey">
                Recover from failures, wire multi-step flows, flip jobs at
                runtime, and keep payloads strongly typed.
              </p>
              <ul className="relative mt-5 space-y-3.5">
                {bentoResilienceHighlights.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 text-sm text-deep-navy dark:text-ghost-white"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand dark:bg-brand/18">
                      <item.icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-blue-slate dark:text-lavender-grey">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
