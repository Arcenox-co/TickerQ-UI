import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.mdx`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const result = rewriteSuffix(request.nextUrl.pathname)
    || (isMarkdownPreferred(request) ? rewriteDocs(request.nextUrl.pathname) : undefined);
  const response = result
    ? NextResponse.rewrite(new URL(result, request.nextUrl))
    : NextResponse.next();
  response.headers.append('Vary', 'Accept');
  return response;
}

export const config = { matcher: ['/docs/:path*'] };
