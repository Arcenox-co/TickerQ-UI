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

        <AnimatedSpan className="text-emerald-600 dark:text-emerald-400">
          ✔ Restoring packages…
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-600 dark:text-emerald-400">
          ✔ Package TickerQ added to the project.
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-600 dark:text-emerald-400">
          ✔ Detected SDK-style project (net8.0+).
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-600 dark:text-emerald-400">
          ✔ Source generator: discovered ticker handlers.
        </AnimatedSpan>

        <AnimatedSpan className="text-emerald-600 dark:text-emerald-400">
          ✔ DI: AddTickerQ() · UseTickerQ() pipeline ready.
        </AnimatedSpan>

        <AnimatedSpan className="text-sky-600 dark:text-sky-400">
          <span>ℹ Tip:</span>
          <span className="pl-2">
            decorate with [TickerFunction(&quot;name&quot;)] or
            MapTicker&lt;T&gt;().
          </span>
        </AnimatedSpan>

        <TypingAnimation className="text-fd-muted-foreground" as="span">
          Success! Schedule jobs with ITimeTickerManager / ICronTickerManager.
        </TypingAnimation>

        <TypingAnimation className="text-fd-muted-foreground" as="span">
          See docs for EF Core, Redis, and the dashboard.
        </TypingAnimation>
      </Terminal>
    </div>
  );
}
