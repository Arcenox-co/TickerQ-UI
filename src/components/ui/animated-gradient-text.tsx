"use client";

import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedGradientTextProps
  extends ComponentPropsWithoutRef<"span"> {
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
}

/** Magic UI–style animated gradient fill on text (see magicui.design/docs/components/animated-gradient-text). */
export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "hsl(217 91% 52%)",
  colorTo = "hsl(262 83% 58%)",
  style,
  ...props
}: AnimatedGradientTextProps) {
  const bgSize = `${speed * 300}% 100%`;
  return (
    <span
      style={
        {
          "--color-from": colorFrom,
          "--color-to": colorTo,
          backgroundImage:
            "linear-gradient(90deg, var(--color-from), var(--color-to), var(--color-from))",
          backgroundSize: bgSize,
          backgroundPosition: "0% 50%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "gradient 8s linear infinite",
          ...style,
        } as CSSProperties
      }
      className={cn("inline align-baseline", className)}
      {...props}
    >
      {children}
    </span>
  );
}
