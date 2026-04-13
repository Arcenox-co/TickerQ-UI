import {
  HomeHeroSection,
  HomeMetricsMagicSections,
  SiteFooter,
  TickerQCapabilitiesSplit,
  TickerQBentoFeatures,
  TickerQDarkCtaBanner,
} from "./_components";

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
