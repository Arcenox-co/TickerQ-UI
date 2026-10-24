import Image from "next/image";
import { dashboardScreenshot } from "@/lib/dashboard-images";

export function DashboardScreenshot({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  const src = dashboardScreenshot(name);
  return (
    <figure className="not-prose my-7 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size screenshot: ${alt}`} className="block bg-[#080c16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary">
        <Image src={src} alt={alt} width={1440} height={920} sizes="(max-width: 800px) 100vw, 850px" className="h-auto w-full" unoptimized />
      </a>
      <figcaption className="px-4 py-3 text-sm leading-relaxed text-fd-muted-foreground">{caption}<span className="mt-1 block text-xs">Select the image to view it at full size.</span></figcaption>
    </figure>
  );
}
