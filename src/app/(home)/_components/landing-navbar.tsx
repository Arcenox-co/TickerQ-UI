"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { FumadocsThemeSwitch } from "@/components/fumadocs-theme-switch";
import { cn } from "@/lib/cn";
import { linkItems } from "@/lib/layout.shared";
import { appName, docsRoute } from "@/lib/shared";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";

const navLinkClass =
  "text-sm font-medium text-blue-slate transition-colors hover:text-deep-navy dark:text-lavender-grey dark:hover:text-ghost-white";

function isIconItem(
  item: LinkItemType,
): item is Extract<LinkItemType, { type: "icon" }> {
  return item.type === "icon";
}

export function LandingNavbar(props: ComponentProps<"header">) {
  const iconLinks = linkItems.filter(isIconItem);

  return (
    <header
      id="nd-nav"
      {...props}
      className={cn(
        "sticky border-b border-platinum/80 dark:border-neutral-800 top-0 z-40 bg-background backdrop-blur-md dark:bg-neutral-950",
        props.className,
      )}
    >
      <div className="mx-auto  flex h-14 w-full max-w-[var(--fd-layout-width)] items-center justify-between gap-3 px-4">
        <nav
          aria-label="Primary"
          className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto sm:gap-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-deep-navy dark:text-ghost-white"
          >
            <Image
              src="/tickerq-logo.svg"
              width={24}
              height={24}
              sizes="64px"
              alt=""
              className="size-6"
              unoptimized
            />
            <span className="font-semibold tracking-tight">{appName}</span>
          </Link>

          <Link href="/docs/releases" className={cn(navLinkClass, "shrink-0")}>
            Releases
          </Link>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          {/* Hub launch CTA — always visible across docs + landing. Filled
              pill so it reads as the primary action vs the muted text links
              and ghost-icon buttons on either side. */}
          <a
            href="https://hub.tickerq.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-deep-navy to-space-indigo px-4 py-1.5 text-[12.5px] font-semibold text-bright-snow shadow-[0_6px_18px_-6px_hsl(225_66%_21%/0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-6px_hsl(226_66%_17%/0.55)]"
          >
            Open Hub
            <svg
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
          <FullSearchTrigger
            hideIfDisabled
            className="hidden min-w-[240px] sm:inline-flex md:min-w-[240px]"
          />
          <SearchTrigger
            hideIfDisabled
            className={cn(
              buttonVariants({ size: "icon-sm", color: "ghost" }),
              "sm:hidden",
            )}
          />
          <FumadocsThemeSwitch
            mode="light-dark"
            className="shrink-0 border-platinum/80 dark:border-white/15"
          />
          {iconLinks.map((item) => (
            <a
              key={item.label ?? item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={cn(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-platinum/80 bg-fd-background text-fd-muted-foreground transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground dark:border-white/15 [&_svg]:size-4",
              )}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
