"use client";

import Link from "next/link";
import { ArrowRight, Book, Github, Package } from "iconoir-react";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { DotPattern } from "@/components/ui/dot-pattern";
import { showcaseTextAnimate } from "./showcase-tokens";

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
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-bright-snow backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <Book className="size-4" strokeWidth={2} />
              Documentation
            </Link>
            <a
              href="https://www.nuget.org/packages/TickerQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-bright-snow backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <Package className="size-4" strokeWidth={2} />
              NuGet
            </a>
            <a
              href="https://github.com/arcenox-co/tickerq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-bright-snow backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <Github className="size-4" strokeWidth={2} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
