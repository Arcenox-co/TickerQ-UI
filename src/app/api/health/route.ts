// Check the running container, not a response generated during next build.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    { status: 'ok', revision: process.env.APP_REVISION ?? 'unknown' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
