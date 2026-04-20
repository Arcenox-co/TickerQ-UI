"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const INSTALL_CMD = "dotnet add package TickerQ";

const CheckIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const CopyIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export function CopyInstallCommandButton({
  className,
}: {
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "group relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-transparent text-fd-muted-foreground transition-[background-color,border-color,box-shadow,color,transform] duration-200 hover:border-fd-border hover:bg-fd-muted/50 hover:text-fd-foreground active:scale-90",
        copied &&
          "border-emerald-500/45 bg-emerald-500/[0.14] text-emerald-600 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:text-emerald-400 dark:shadow-[0_0_12px_-2px_rgba(52,211,153,0.35)]",
        className,
      )}
      aria-label={copied ? "Copied to clipboard" : "Copy install command"}
    >
      <span
        className={cn(
          "absolute inline-flex items-center justify-center transition-[opacity,transform] duration-200",
          copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
        )}
      >
        <CopyIcon />
      </span>
      <span
        className={cn(
          "absolute inline-flex items-center justify-center transition-[opacity,transform] duration-200",
          copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
        )}
      >
        <CheckIcon />
      </span>
    </button>
  );
}
