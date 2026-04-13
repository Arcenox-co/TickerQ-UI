import { NextResponse } from "next/server";

import { gitConfig } from "@/lib/shared";

const NUGET_QUERY =
  "https://azuresearch-usnc.nuget.org/query?q=packageid:tickerq&take=1";

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "TickerQ-Docs-Site",
} as const;

type LibraryStatsPayload = {
  downloads: number;
  stars: number;
  forks: number;
  contributors: number;
  totalContributions: number;
};

export async function GET() {
  const repo = `${gitConfig.user}/${gitConfig.repo}`;

  try {
    const [repoRes, contributorsRes, nugetRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        headers: GH_HEADERS,
        next: { revalidate: 300 },
      }),
      fetch(
        `https://api.github.com/repos/${repo}/contributors?per_page=100`,
        {
          headers: GH_HEADERS,
          next: { revalidate: 300 },
        },
      ),
      fetch(NUGET_QUERY, { next: { revalidate: 300 } }),
    ]);

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: "GitHub repository unavailable" },
        { status: 502 },
      );
    }

    const repoJson = (await repoRes.json()) as {
      stargazers_count?: number;
      forks_count?: number;
    };

    let contributorsJson: { contributions?: number }[] = [];
    if (contributorsRes.ok) {
      contributorsJson = (await contributorsRes.json()) as {
        contributions?: number;
      }[];
    }

    const nugetJson = (await nugetRes.json()) as {
      data?: { totalDownloads?: number }[];
    };

    const totalContributions = contributorsJson.reduce(
      (acc, c) => acc + (c.contributions ?? 0),
      0,
    );

    const payload: LibraryStatsPayload = {
      downloads: nugetJson.data?.[0]?.totalDownloads ?? 0,
      stars: repoJson.stargazers_count ?? 0,
      forks: repoJson.forks_count ?? 0,
      contributors: contributorsJson.length,
      totalContributions,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load library stats" },
      { status: 502 },
    );
  }
}
