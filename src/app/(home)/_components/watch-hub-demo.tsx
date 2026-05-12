"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Cloudflare Stream embed for the 2-minute Hub demo video. The same video and
 * customer code that the Hub dashboard's landing page uses. Centralised here so
 * a future URL swap (Stream → Bunny → self-host) is a one-line change.
 */
const STREAM_BASE =
  "https://customer-u63pkolmetbd5148.cloudflarestream.com/e7926f1a0080966a410ba96c4ed575d6/iframe";
const STREAM_POSTER = encodeURIComponent(
  "https://customer-u63pkolmetbd5148.cloudflarestream.com/e7926f1a0080966a410ba96c4ed575d6/thumbnails/thumbnail.jpg?time=5s&height=600",
);
// Stream treats `autoplay` as a flag — presence (even `=false`) is interpreted
// as "on". To NOT autoplay we have to omit the parameter entirely. preload=none
// tells the player not to fetch media until the user clicks play.
const VIDEO_SRC = `${STREAM_BASE}?preload=none&poster=${STREAM_POSTER}`;

// localStorage key for "user clicked Skip" — when present we don't auto-open
// the video on subsequent visits. The user can still re-open via the button.
const SKIP_FLAG_KEY = "tickerq.hubDemo.autoOpenSkipped";

/**
 * Renders both the auto-open behavior on first visit and a reusable
 * "Watch Hub demo" button. Pass `buttonClassName` to style the button to
 * match the surrounding CTAs.
 */
export function WatchHubDemo({
  buttonClassName,
  buttonLabel = "Watch Hub demo",
}: {
  buttonClassName?: string;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  // `autoOpened` distinguishes the first-visit popup from a manual click —
  // controls which Stream src is used (autoplay-muted on first visit so the
  // browser doesn't block playback; manual click leaves it to the user).
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(SKIP_FLAG_KEY) === "1") return;
    } catch {
      // localStorage may be unavailable (private mode, denied permission).
      // Skip the auto-open in that case — the manual button still works.
      return;
    }
    setAutoOpened(true);
    setOpen(true);
  }, []);

  const dismiss = useCallback((markSkipped: boolean) => {
    setOpen(false);
    setAutoOpened(false);
    if (markSkipped && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SKIP_FLAG_KEY, "1");
      } catch {
        // ignore — best-effort persistence
      }
    }
  }, []);

  // Esc-to-close so the modal feels native even without a Dialog primitive.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss(autoOpened);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, autoOpened, dismiss]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setAutoOpened(false);
          setOpen(true);
        }}
        className={
          buttonClassName ??
          "inline-flex items-center gap-2 rounded-full border border-deep-navy/15 bg-white/70 px-8 py-3.5 text-sm font-semibold text-deep-navy backdrop-blur-md transition hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-ghost-white dark:hover:bg-white/[0.08]"
        }
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
        <span>{buttonLabel}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="TickerQ Hub demo video"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close demo"
            onClick={() => dismiss(autoOpened)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-2xl">
            <iframe
              src={VIDEO_SRC}
              title="TickerQ Hub demo"
              loading="eager"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="aspect-video w-full border-0"
            />
            {/* Beta-launch promo: surface the early-adopter discount inside the
                video shell so users see it the moment the modal opens — not
                buried in a separate marketing banner. CTA on the right converts
                directly from the modal. */}
            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-gradient-to-r from-deep-navy/95 via-space-indigo/95 to-deep-navy/95 px-4 py-3 text-center text-[12.5px] font-semibold text-white">
              <span>
                <span className="mr-1.5 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/90">
                  Beta
                </span>
                Join the Hub Beta today and get <span className="text-amber-300">30% off your first year</span>.
              </span>
              <a
                href="https://hub.tickerq.net"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold text-deep-navy shadow transition hover:bg-white/90"
              >
                Go to Hub
                <svg
                  className="size-3 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-neutral-950 px-4 py-3 text-[12px] text-white/80">
              <span>TickerQ Hub — 2 minute walkthrough</span>
              <div className="flex items-center gap-2">
                {autoOpened && (
                  <button
                    type="button"
                    onClick={() => dismiss(true)}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] text-white/85 hover:bg-white/10"
                  >
                    Skip and don&apos;t show again
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dismiss(autoOpened)}
                  className="rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-deep-navy hover:bg-white/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
