"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "iconoir-react";

export function FooterNewsletter() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="w-full max-w-xl md:justify-self-end">
      {done ? (
        <p className="rounded-full border border-white/15 bg-white/5 px-5 py-4 text-sm text-platinum">
          Thanks! Follow{" "}
          <a
            href="https://github.com/arcenox-co/tickerq/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-bright-snow underline decoration-white/30 underline-offset-2 hover:decoration-white/60"
          >
            releases on GitHub
          </a>{" "}
          for now — plug in a newsletter provider when you are ready.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="relative flex items-center rounded-full border border-white/15 bg-bright-snow p-1.5 pl-5 shadow-inner">
            <label htmlFor="footer-email" className="sr-only">
              Email
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-deep-navy placeholder:text-blue-slate/70 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-deep-navy px-5 py-2.5 text-sm font-semibold text-bright-snow transition-[transform,background-color] hover:bg-space-indigo active:scale-[0.98]"
            >
              Subscribe
            </button>
          </div>
          <a
            href="https://www.nuget.org/packages?q=TickerQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-platinum/90 transition-colors hover:text-bright-snow"
          >
            <ArrowRight className="size-3.5" strokeWidth={2} />
            Browse TickerQ packages on NuGet
          </a>
        </form>
      )}
    </div>
  );
}
