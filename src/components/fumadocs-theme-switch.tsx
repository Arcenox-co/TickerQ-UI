'use client';

import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import type { ThemeSwitchProps } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

/** Fumadocs theme slot: Magic UI animated toggle for light/dark; default switch when system mode is enabled. */
export function FumadocsThemeSwitch(props: ThemeSwitchProps) {
  if (props.mode === 'light-dark-system') {
    return <ThemeSwitch {...props} />;
  }
  return <AnimatedThemeToggler className={props.className} />;
}
