"use client";

import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal";
import { cn } from "@/lib/utils";

export function HeroTickerqTerminal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl translate-y-4 md:translate-y-6",
        className,
      )}
      style={{
        filter: "drop-shadow(0 28px 60px hsl(217 91% 50% / 0.38))",
      }}
    >
      <Terminal
        className="max-h-[min(420px,55vh)] w-full max-w-none border-fd-border bg-fd-card text-fd-foreground shadow-2xl ring-1 ring-black/[0.06] dark:ring-white/10"
        sequence
        startOnView
      >
        <TypingAnimation as="span" className="text-fd-foreground">
          {"> dotnet add package TickerQ"}
        </TypingAnimation>

        <AnimatedSpan className="text-emerald-700 dark:text-emerald-300">
          ✔ Restoring packages…
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-700 dark:text-emerald-300">
          ✔ Package TickerQ added to the project.
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-700 dark:text-emerald-300">
          ✔ Detected SDK-style project (net8.0+).
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-700 dark:text-emerald-300">
          ✔ Source generator: discovered ticker handlers.
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-700 dark:text-emerald-300">
          ✔ DI: AddTickerQ() · UseTickerQ() pipeline ready.
        </AnimatedSpan>

        <AnimatedSpan className="text-sky-700 dark:text-sky-300">
          <span>ℹ Tip:</span>
          <span className="pl-2">
            decorate with [TickerFunction(&quot;name&quot;)] or
            MapTicker&lt;T&gt;().
          </span>
        </AnimatedSpan>

        <TypingAnimation className="text-fd-foreground/80" as="span">
          Success! Schedule jobs with ITimeTickerManager / ICronTickerManager.
        </TypingAnimation>

        <TypingAnimation className="text-fd-foreground/80" as="span">
          See docs for EF Core, Redis, and the dashboard.
        </TypingAnimation>
      </Terminal>
    </div>
  );
}
