/** Shared visual / animation tokens for home showcase sections */

export const showcaseTextAnimate = {
  animation: "slideUp" as const,
  by: "word" as const,
  startOnView: true,
  once: true,
};

export const brandGradient = {
  gradientFrom: "hsl(217 91% 58%)",
  gradientTo: "hsl(262 83% 62%)",
  gradientColor: "hsl(217 91% 50%)",
};

/** Solid neutral beam (no hue) — visible on light cards; reads as soft light on dark. */
export const borderBeamNeutral = {
  colorFrom: "hsl(220 14% 88%)",
  colorTo: "hsl(220 14% 88%)",
} as const;

export const bentoCardTitleClass =
  "font-semibold text-2xl text-deep-navy dark:text-ghost-white";
