import { commercialSource, getLLMText } from '@/lib/source';

export const revalidate = 3600;

export async function GET() {
  const pages = await Promise.all(commercialSource.getPages().map(getLLMText));
  return new Response(pages.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
