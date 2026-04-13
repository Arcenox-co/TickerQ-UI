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
