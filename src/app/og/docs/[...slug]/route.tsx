import { allDocPages, getDocumentationPage, getPageImage } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const { page, version } = getDocumentationPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={`TickerQ · ${version === '5.x' ? '5.x Commercial' : 'Legacy'}`} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return allDocPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
