"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Highlighter } from "@/components/ui/highlighter";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/** Achromatic gradients — border + spotlight stay gray, no blue cast. */
const metricGradient = {
  gradientFrom: "hsl(0 0% 99%)",
  gradientTo: "hsl(0 0% 90%)",
  gradientColor: "hsl(0 0% 72%)",
};

const stats = [
  {
    key: "reflection",
    numeric: 0,
    suffix: "ms",
    label: "Reflection Overhead",
    description: "Source-generated at compile time",
  },
  {
    key: "cron",
    numeric: 1,
    suffix: "s",
    label: "Cron Precision",
    description: "Second-level scheduling accuracy",
  },
  {
    key: "aot",
    numeric: 100,
    suffix: "%",
    label: "AOT Compatible",
    description: "Native AOT & trimming ready",
  },
  {
    key: "packages",
    numeric: 6,
    suffix: "",
    label: "NuGet Packages",
    description: "Modular, install what you need",
  },
] as const;

type StatKey = (typeof stats)[number]["key"];

type HighlightStyle = {
  action: "highlight" | "underline" | "box" | "circle" | "bracket";
  color: string;
};

/**
 * Highlights only where it matters: zero-reflection + second-level cron.
 * Other stats stay plain so the annotations stay readable.
 */
const statPresentation: Record<
  StatKey,
  {
    featured?: boolean;
    label?: HighlightStyle;
    description?: HighlightStyle;
  }
> = {
  reflection: {
    description: { action: "underline", color: "#94a3b8" },
  },
  cron: {
    featured: true,
    label: { action: "highlight", color: "#1e293b" }, // dark blue
  },
  aot: {},
  packages: {},
};

const borderBeamNeutral = {
  colorFrom: "hsl(220 14% 88%)",
  colorTo: "hsl(220 14% 88%)",
} as const;

export function HomeMetricsMagicSections() {
  return (
    <>
      <section className=" px-4 py-16 dark:border-space-indigo/60">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((s, i) => {
            const pres = statPresentation[s.key];
            const featured = pres.featured ?? false;

            return (
              <BlurFade key={s.key} inView delay={0.06 * i} offset={10}>
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl",
                    featured &&
                      "ring-1 ring-platinum/80 shadow-md dark:ring-white/15 dark:shadow-lg dark:shadow-black/25",
                  )}
                >
                  <MagicCard
                    className={cn(
                      "h-full min-h-[140px] rounded-2xl shadow-sm",
                      featured && "-translate-y-0.5 shadow-lg",
                    )}
                    glassAlwaysVisible
                    glassOverlayClassName={cn(
                      "bg-gradient-to-br from-white/92 via-bright-snow/88 to-neutral-200/25 ring-1 ring-neutral-200/45",
                      "dark:bg-gradient-to-br dark:from-neutral-900/50 dark:via-neutral-950/40 dark:to-neutral-900/60 dark:ring-white/5",
                    )}
                    gradientSize={220}
                    gradientFrom={metricGradient.gradientFrom}
                    gradientTo={metricGradient.gradientTo}
                    gradientColor={metricGradient.gradientColor}
                    gradientOpacity={featured ? 0.06 : 0.03}
                    gradientAlwaysVisible
                  >
                    <div className="flex h-full flex-col justify-center px-4 py-5 text-center md:px-5 md:text-left">
                      <p className="flex items-baseline justify-center gap-0.5 font-mono text-2xl font-bold tabular-nums tracking-tight text-deep-navy sm:text-3xl dark:text-ghost-white md:justify-start">
                        <NumberTicker
                          value={s.numeric}
                          className="!text-deep-navy dark:!text-ghost-white"
                        />
                        {s.suffix ? (
                          <span className="text-deep-navy dark:text-ghost-white">
                            {s.suffix}
                          </span>
                        ) : null}
                      </p>
                      <p
                        className={cn(
                          "mt-2 text-sm font-semibold",
                          pres.label?.action === "highlight"
                            ? "text-white dark:text-ghost-white"
                            : "text-deep-navy dark:text-ghost-white",
                        )}
                      >
                        {pres.label ? (
                          <Highlighter
                            action={pres.label.action}
                            color={pres.label.color}
                            isView
                            animationDuration={550}
                            iterations={2}
                          >
                            <span
                              className={cn(
                                "inline",
                                pres.label.action === "highlight" &&
                                  "text-white! dark:text-ghost-white!",
                              )}
                            >
                              {s.label}
                            </span>
                          </Highlighter>
                        ) : (
                          <span className="inline">{s.label}</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-blue-slate dark:text-lavender-grey">
                        {pres.description ? (
                          <Highlighter
                            action={pres.description.action}
                            color={pres.description.color}
                            isView
                            animationDuration={500}
                            iterations={2}
                            strokeWidth={1.25}
                          >
                            <span className="inline">{s.description}</span>
                          </Highlighter>
                        ) : (
                          <span className="inline">{s.description}</span>
                        )}
                      </p>
                    </div>
                  </MagicCard>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </section>
    </>
  );
}
