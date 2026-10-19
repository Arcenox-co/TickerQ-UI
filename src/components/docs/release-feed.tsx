import { getCommercialReleases } from '@/lib/github-releases';
import { ReleaseFeedView } from './release-feed-view';

export async function ReleaseFeed() {
  return <ReleaseFeedView feed={await getCommercialReleases()} />;
}
