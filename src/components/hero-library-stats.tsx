"use client";

import { useEffect, useState } from "react";
import {
  Community,
  Download,
  GitBranch,
  Sparks,
  Star,
} from "iconoir-react";

type LibraryStatsPayload = {
  downloads: number;
  stars: number;
  forks: number;
  contributors: number;
  totalContributions: number;
};

function formatStat(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function Stat({
  icon: Icon,
  label,
  value,
  showValue,
  iconClassName,
}: {
  icon: typeof Star;
  label: string;
  value: number;
  showValue: boolean;
  iconClassName: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-platinum/90 bg-white/80 px-3 py-1.5 text-xs font-medium text-deep-navy shadow-sm backdrop-blur-sm dark:border-space-indigo/80 dark:bg-deep-navy/55 dark:text-ghost-white">
      <Icon
        className={`size-3.5 shrink-0 ${iconClassName}`}
        strokeWidth={2}
      />
      <span className="text-blue-slate dark:text-lavender-grey">{label}</span>
      <span className="tabular-nums font-semibold text-deep-navy dark:text-bright-snow">
        {!showValue ? (
          <span className="inline-block min-w-9">—</span>
        ) : (
          formatStat(value)
        )}
      </span>
    </div>
  );
}

export function HeroLibraryStats() {
  const [data, setData] = useState<LibraryStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/library-stats");
        if (!res.ok) throw new Error("bad response");
        const json = (await res.json()) as LibraryStatsPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showValue = !loading && data !== null;
  const d: LibraryStatsPayload = data ?? {
    downloads: 0,
    stars: 0,
    forks: 0,
    contributors: 0,
    totalContributions: 0,
  };

  return (
    <div
      className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      aria-live="polite"
    >
      <Stat
        icon={Download}
        label="NuGet downloads"
        value={d.downloads}
        showValue={showValue}
        iconClassName="text-emerald-600 dark:text-emerald-400"
      />
      <Stat
        icon={Star}
        label="GitHub stars"
        value={d.stars}
        showValue={showValue}
        iconClassName="text-amber-500 dark:text-amber-400"
      />
      <Stat
        icon={GitBranch}
        label="Forks"
        value={d.forks}
        showValue={showValue}
        iconClassName="text-violet-600 dark:text-violet-400"
      />
      <Stat
        icon={Community}
        label="Contributors"
        value={d.contributors}
        showValue={showValue}
        iconClassName="text-sky-600 dark:text-sky-400"
      />
      <Stat
        icon={Sparks}
        label="Contributions"
        value={d.totalContributions}
        showValue={showValue}
        iconClassName="text-rose-500 dark:text-rose-400"
      />
    </div>
  );
}
