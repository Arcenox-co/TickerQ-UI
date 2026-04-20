import dynamic from "next/dynamic";
import { HomeHeroSection, SiteFooter } from "./_components";

// Defer below-the-fold sections — they load once the user scrolls past the hero
const HomeMetricsMagicSections = dynamic(
  () => import("./_components").then((m) => ({ default: m.HomeMetricsMagicSections })),
  { loading: () => <div className="min-h-[300px]" /> },
);
const TickerQBentoFeatures = dynamic(
  () => import("./_components").then((m) => ({ default: m.TickerQBentoFeatures })),
  { loading: () => <div className="min-h-[300px]" /> },
);
const TickerQCapabilitiesSplit = dynamic(
  () => import("./_components").then((m) => ({ default: m.TickerQCapabilitiesSplit })),
  { loading: () => <div className="min-h-[300px]" /> },
);
const TickerQDarkCtaBanner = dynamic(
  () => import("./_components").then((m) => ({ default: m.TickerQDarkCtaBanner })),
  { loading: () => <div className="min-h-[200px]" /> },
);

export default function HomePage() {
  return (
    <>
      <main className="flex flex-col">
        <HomeHeroSection />
        <HomeMetricsMagicSections />
        <TickerQBentoFeatures />
        <TickerQCapabilitiesSplit />
        <TickerQDarkCtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
