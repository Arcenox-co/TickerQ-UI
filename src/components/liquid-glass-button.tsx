import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { ComponentProps, ReactNode } from 'react';

const liquidGlassClassName = cn(
  'group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold',
  'border border-black/[0.08] bg-white/35 text-fd-foreground shadow-lg backdrop-blur-xl',
  'hover:border-black/[0.12] hover:bg-white/55 hover:shadow-xl',
  'dark:border-white/20 dark:bg-white/10 dark:shadow-black/30',
  'dark:hover:border-white/30 dark:hover:bg-white/[0.16]',
  'transition-[background-color,border-color,box-shadow] duration-300',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background',
);

/** Inner layer from the “Demo 1” pattern: slight backdrop blur over the whole control */
function GlassLayers() {
  return (
    <span
      className="pointer-events-none absolute inset-0 rounded-2xl backdrop-blur-[1px]"
      aria-hidden
    />
  );
}

type LiquidGlassButtonProps = Omit<ComponentProps<'button'>, 'className'> & {
  children: ReactNode;
  className?: string;
};

export function LiquidGlassButton({
  children,
  className,
  type = 'button',
  ...props
}: LiquidGlassButtonProps) {
  return (
    <button type={type} className={cn(liquidGlassClassName, className)} {...props}>
      <GlassLayers />
      <span className="relative z-1 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

type LiquidGlassLinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  children: ReactNode;
  className?: string;
};

export function LiquidGlassLink({ children, className, ...props }: LiquidGlassLinkProps) {
  return (
    <Link className={cn(liquidGlassClassName, className)} {...props}>
      <GlassLayers />
      <span className="relative z-1 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
