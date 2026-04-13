"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "iconoir-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

const INSTALL_CMD = "dotnet add package TickerQ";

const springIcon = {
  type: "spring" as const,
  stiffness: 520,
  damping: 26,
  mass: 0.65,
};

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
    <motion.button
      type="button"
      onClick={onCopy}
      whileTap={{ scale: 0.9 }}
      animate={
        copied
          ? {
              scale: [1, 1.12, 1],
              transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
            }
          : { scale: 1 }
      }
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-transparent text-fd-muted-foreground transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-fd-border hover:bg-fd-muted/50 hover:text-fd-foreground",
        copied &&
          "border-emerald-500/45 bg-emerald-500/[0.14] text-emerald-600 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:text-emerald-400 dark:shadow-[0_0_12px_-2px_rgba(52,211,153,0.35)]",
        className,
      )}
      aria-label={copied ? "Copied to clipboard" : "Copy install command"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            className="inline-flex will-change-transform"
            initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            transition={springIcon}
          >
            <Check className="size-4" strokeWidth={2.5} aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="inline-flex will-change-transform"
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.75, filter: "blur(3px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Copy className="size-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
