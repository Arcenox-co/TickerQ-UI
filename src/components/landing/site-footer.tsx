import Image from "next/image";
import Link from "next/link";
import { EvPlug, Github, Heart, Linkedin } from "iconoir-react";
import { appName, gitConfig } from "@/lib/shared";
import { CopyInstallCommandButton } from "@/components/copy-install-command-button";
import { FooterNewsletter } from "@/components/landing/footer-newsletter";
import { TextAnimate } from "@/registry/magicui/text-animate";

const ta = {
  animation: "slideUp" as const,
  by: "word" as const,
  startOnView: true,
  once: true,
};

const githubRepo = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
const nugetCore = "https://www.nuget.org/packages/TickerQ";

const mainColumns: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Start",
    links: [
      { label: "Quick start", href: "/docs/getting-started/quick-start" },
      { label: "What is TickerQ?", href: "/docs/what-is-tickerq" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Dashboard", href: "/docs/dashboard" },
      { label: "Entity Framework", href: "/docs/entity-framework" },
      { label: "Redis", href: "/docs/redis" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "OpenTelemetry", href: "/docs/opentelemetry" },
      { label: "API reference", href: "/docs/api-reference" },
      {
        label: "Releases",
        href: `${githubRepo}/releases`,
        external: true,
      },
    ],
  },
];

const utilityLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "GitHub", href: githubRepo, external: true },
  { label: "NuGet", href: nugetCore, external: true },
  {
    label: "Open Collective",
    href: "https://opencollective.com/tickerq",
    external: true,
  },
];

const social: {
  label: string;
  href: string;
  icon: typeof Github;
}[] = [
  { label: "NuGet", href: nugetCore, icon: EvPlug },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/albertkunushevci",
    icon: Linkedin,
  },
  { label: "GitHub", href: githubRepo, icon: Github },
  {
    label: "Open Collective",
    href: "https://opencollective.com/tickerq",
    icon: Heart,
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[hsl(226_66%_5%)] text-bright-snow">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,hsl(217_91%_38%/0.22),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,2.2fr)] lg:gap-16">
          <div>
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-bold tracking-tight text-bright-snow"
                >
                  <Image
                    src="/tickerq-logo.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="size-7"
                    aria-hidden
                    unoptimized
                  />
                  {appName}
                </Link>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-platinum/90">
                  Source-generated background jobs for .NET — cron, retries, and
                  a real-time dashboard without the reflection tax.
                </p>
              </div>
            </div>
            <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-platinum bg-ghost-white-2/95 px-3 py-2 font-mono text-sm text-deep-navy shadow-inner backdrop-blur-sm dark:border-space-indigo dark:bg-deep-navy/50 dark:text-ghost-white sm:gap-3 sm:px-5 sm:py-3">
              <span className="shrink-0 text-deep-navy select-none dark:text-platinum">
                $
              </span>
              <TextAnimate
                {...ta}
                as="span"
                className="inline font-mono text-xs"
              >
                dotnet add package TickerQ
              </TextAnimate>
              <CopyInstallCommandButton className="text-deep-navy hover:border-platinum hover:bg-platinum/25 hover:text-deep-navy dark:text-platinum dark:hover:border-white/25 dark:hover:bg-white/10 dark:hover:text-bright-snow" />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {mainColumns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-lavender-grey">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((item) => (
                    <li key={item.href}>
                      <FooterLink {...item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-lavender-grey">
                Resources
              </p>
              <ul className="mt-4 space-y-3">
                {utilityLinks.map((item) => (
                  <li key={item.href}>
                    <FooterLink {...item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-y border-white/10 py-14 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-bright-snow md:text-3xl lg:text-[2rem] lg:leading-tight">
              Background jobs that feel native to .NET.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-platinum/90">
              Get release notes and docs drops. No spam — unsubscribe anytime
              once this is connected to a provider.
            </p>
          </div>
          <FooterNewsletter />
        </div>

        <div className="mt-12 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs leading-relaxed text-platinum/75 md:text-left">
            © {year} {appName} · Open source under MIT ·{" "}
            <a
              href="https://linkedin.com/in/albertkunushevci"
              target="_blank"
              rel="noopener noreferrer"
              className="text-platinum transition-colors hover:text-bright-snow"
            >
              Albert Kunushevci
            </a>
            <Heart
              className="mx-1 inline-block size-3.5 align-[-0.15em] text-red-500"
              strokeWidth={2}
              fill="currentColor"
              aria-hidden
            />
            · A project by{" "}
            <a
              href="https://github.com/arcenox-co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-platinum transition-colors hover:text-bright-snow"
            >
              Arcenox
            </a>
          </p>
          <ul className="flex items-center justify-center gap-3 md:justify-end">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-bright-snow transition-[transform,background-color,colors] hover:bg-white/10 hover:text-bright-snow"
                  aria-label={item.label}
                >
                  <item.icon className="size-5" strokeWidth={1.75} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  label,
  href,
  external,
}: {
  label: string;
  href: string;
  external?: boolean;
}) {
  const className =
    "text-sm text-platinum/90 transition-colors hover:text-bright-snow";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
