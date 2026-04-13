'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import { flushSync } from 'react-dom';
import { MoonSat, SunLight } from 'iconoir-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface AnimatedThemeTogglerProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  duration?: number;
}

/**
 * @magicui/animated-theme-toggler — view transition + circle reveal.
 * Integrated with `next-themes` for Fumadocs / RootProvider.
 */
export function AnimatedThemeToggler({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button || !mounted) return;

    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

    const applyTheme = () => {
      setTheme(newTheme);
    };

    if (typeof document.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    const { left, width, top, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    const ready = transition?.ready;
    if (ready && typeof ready.then === 'function') {
      void ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
    }
  }, [duration, mounted, resolvedTheme, setTheme]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      data-theme-toggle=""
      aria-label="Toggle theme"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-fd-border bg-fd-background text-fd-muted-foreground transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground',
        className,
      )}
      {...props}
    >
      {mounted ? (
        isDark ? (
          <SunLight className="size-4" />
        ) : (
          <MoonSat className="size-4" />
        )
      ) : (
        <MoonSat className="size-4 opacity-40" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
