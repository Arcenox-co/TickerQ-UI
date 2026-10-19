import { allDocPages, getDocumentationPage, getPageImage, getPageMarkdownUrl, pageRouteSegments } from '@/lib/source';
import { docsVersions } from '@/lib/docs-versions';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import Link from 'next/link';

// Refresh release notes, including a build-time fallback, without a redeploy.
export const revalidate = 3600;

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const { page, source, version } = getDocumentationPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} tableOfContent={{ style: 'clerk' }}>
      <div className="mb-5 rounded-lg border border-fd-border bg-fd-secondary/60 px-4 py-3 text-sm text-fd-muted-foreground">
        {version === '5.x' ? (
          <><strong className="text-fd-foreground">5.x commercial documentation</strong> · For 10.5.x, 9.5.x, and 8.5.x packages. Community, Evaluation, and paid subscriptions share these docs.</>
        ) : (
          <><strong className="text-fd-foreground">Legacy documentation</strong> · For earlier releases. <Link href="/docs/5.x" className="text-fd-primary underline underline-offset-4">View the 5.x commercial docs →</Link></>
        )}
      </div>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/Arcenox-co/TickerQ-UI/blob/main/${docsVersions[version].contentDir}/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return allDocPages().map((page) => ({ slug: pageRouteSegments(page) }));
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const { page, version } = getDocumentationPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title === 'TickerQ 5.x' ? page.data.title : `${page.data.title} · ${version === '5.x' ? '5.x' : 'Legacy'}`,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: `${page.data.title} · ${docsVersions[version].label}`,
      description: page.data.description,
      url: page.url,
      images: getPageImage(page).url,
    },
  };
}
