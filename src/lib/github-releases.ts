import { unstable_cache } from 'next/cache';
import { fetchCommercialReleases, type ReleaseFeedData } from './releases';

const cachedReleases = unstable_cache(fetchCommercialReleases, ['tickerq-public-5x-releases-v1'], { revalidate: 3600 });

export async function getCommercialReleases(): Promise<ReleaseFeedData> {
  try {
    return await cachedReleases();
  } catch {
    // A cold-cache outage is distinct from an empty release history. Next retains
    // the last successful result if a later background revalidation fails.
    return { status: 'unavailable' };
  }
}
