"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Only load the chunk when the placeholder enters the viewport
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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-3xl translate-y-4 md:translate-y-6"
    >
      {visible ? (
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
