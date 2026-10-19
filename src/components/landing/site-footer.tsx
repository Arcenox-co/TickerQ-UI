import Image from "next/image";
import Link from "next/link";

const groups = [
  { title: "Learn", links: [["5.x documentation", "/docs/5.x"], ["Quick start", "/docs/5.x/getting-started/quick-start"], ["Dashboard tour", "/docs/5.x/dashboard/tour"], ["Legacy documentation", "/docs"]] },
  { title: "Build", links: [["Job chains", "/docs/5.x/guides/recurring-chains"], ["Integrations", "/docs/5.x/integrations"], ["Storage providers", "/docs/5.x/entity-framework"], ["AI assistant", "/docs/5.x/dashboard/ai-assistant"]] },
  { title: "TickerQ", links: [["Get a license", "https://license.tickerq.net"], ["Plans", "https://license.tickerq.net/pricing"], ["GitHub", "https://github.com/Arcenox-co/TickerQ/tree/main-commercial"], ["Changelog", "/docs/5.x/changelog"]] },
];
export function SiteFooter() {
  return (
    <footer className="border-t border-fd-border bg-fd-muted/30">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><Link href="/" className="inline-flex items-center gap-2.5 font-semibold"><Image src="/tickerq-logo.svg" alt="" width={26} height={26} unoptimized />TickerQ</Link><p className="mt-4 max-w-xs text-sm leading-6 text-fd-muted-foreground">Background jobs, workflows, and monitoring for .NET. Built and maintained by Arcenox.</p></div>
          {groups.map(group => <div key={group.title}><p className="text-sm font-semibold">{group.title}</p><ul className="mt-4 space-y-3">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-fd-muted-foreground hover:text-fd-foreground">{label}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground"><p>© {new Date().getFullYear()} Arcenox. TickerQ 5.x is source-available under the TickerQ Software License Agreement.</p><Link href="/docs/5.x/getting-started/licensing" className="underline underline-offset-4 hover:text-fd-foreground">Licensing and eligibility</Link></div>
      </div>
    </footer>
  );
}
