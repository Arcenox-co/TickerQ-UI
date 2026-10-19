import { documentationSources } from '@/lib/source';
import { isDocsVersion } from '@/lib/docs-versions';
import { createFromSource } from 'fumadocs-core/search/server';

const searches = {
  '5.x': createFromSource(documentationSources['5.x'], { language: 'english' }),
  legacy: createFromSource(documentationSources.legacy, { language: 'english' }),
};

export async function GET(request: Request) {
  const version = new URL(request.url).searchParams.get('version') ?? 'legacy';
  if (!isDocsVersion(version)) return Response.json({ error: 'Unknown documentation version.' }, { status: 400 });
  return searches[version].GET(request);
}
