"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Only load the chunk after first user interaction or after LCP measurement
// window has closed, so the animated terminal text can never become the LCP element.
const HeroTickerqTerminal = dynamic(
  () =>
    import("@/components/hero-tickerq-terminal").then(
      (m) => m.HeroTickerqTerminal,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HeroTerminalLazy() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    // Mount on first user interaction (scroll/touch/click/keydown/mousemove) OR
    // after a hard delay once the browser is idle — whichever comes first.
    // This ensures LCP is always measured on the static H1 above, not on the
    // animated terminal text below.
    const mountNow = () => setMount(true);

    const events: Array<keyof WindowEventMap> = [
      "scroll",
      "pointerdown",
      "keydown",
      "touchstart",
      "mousemove",
    ];
    events.forEach((e) =>
      window.addEventListener(e, mountNow, { once: true, passive: true }),
    );

    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    }).requestIdleCallback;

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    if (idle) {
      idleHandle = idle(mountNow, { timeout: 6000 });
    } else {
      timeoutHandle = setTimeout(mountNow, 4000);
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, mountNow));
      const cancel = (window as unknown as {
        cancelIdleCallback?: (handle: number) => void;
      }).cancelIdleCallback;
      if (idleHandle !== undefined && cancel) cancel(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-3xl translate-y-4 md:translate-y-6"
      style={{ contentVisibility: "auto", containIntrinsicSize: "420px" }}
    >
      {mount ? (
        <HeroTickerqTerminal />
      ) : (
        <div
          className="h-[min(420px,55vh)] w-full rounded-2xl border border-fd-border bg-fd-card shadow-2xl ring-1 ring-black/[0.06] dark:ring-white/10"
          aria-hidden
        />
      )}
    </div>
  );
}
