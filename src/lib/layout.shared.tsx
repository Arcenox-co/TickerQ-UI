import type { CSSProperties } from "react";
import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { FumadocsThemeSwitch } from "@/components/fumadocs-theme-switch";
import { appName, gitConfig } from "./shared";
import Image from "next/image";

/** Home layout only: narrow chrome to match landing `container` (`@theme --breakpoint-xl`). Docs use fumadocs default (`97rem` via `var(--fd-layout-width, 97rem)`). */
export const fdLayoutWidthStyle = {
  "--fd-layout-width": "var(--breakpoint-xl)",
} as CSSProperties;

export const linkItems: LinkItemType[] = [
  {
    type: "main",
    text: "Releases",
    url: "/docs/releases",
    on: "nav",
  },
  {
    type: "icon",
    label: "GitHub",
    text: "GitHub",
    url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    external: true,
    icon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    type: "icon",
    label: "NuGet",
    text: "NuGet",
    url: "https://www.nuget.org/packages/TickerQ",
    external: true,
    icon: (
      <svg
        role="img"
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.563 28.844c-7.104 0-7.104-10.651 0-10.651 7.099 0 7.099 10.651 0 10.651zM12.932 16.636c-4.437 0-4.437-6.663 0-6.663 4.443 0 4.443 6.663 0 6.663zM23.797 6.24h-8.891c-4.532 0.005-8.204 3.677-8.209 8.208v8.891c0 4.531 3.677 8.203 8.209 8.203h8.891c2.172 0 4.26-0.864 5.801-2.401 1.537-1.541 2.401-3.624 2.401-5.801v-8.891c0-4.531-3.672-8.208-8.203-8.208zM5.328 3.12c0 3.552-5.328 3.552-5.328 0s5.328-3.552 5.328 0z" />
      </svg>
    ),
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/tickerq-logo.svg"
            width={24}
            height={24}
            sizes="64px"
            alt="TickerQ"
            className="size-6"
            unoptimized
          />
          <span className="font-semibold">{appName}</span>
        </>
      ),
    },
    links: linkItems,
    slots: {
      themeSwitch: FumadocsThemeSwitch,
    },
  };
}
