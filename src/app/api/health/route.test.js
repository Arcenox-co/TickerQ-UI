import { afterEach, expect, test } from 'bun:test';
import { GET } from './route';

const originalRevision = process.env.APP_REVISION;
afterEach(() => {
  if (originalRevision === undefined) delete process.env.APP_REVISION;
  else process.env.APP_REVISION = originalRevision;
});

test('reports the running revision on each request without caching', async () => {
  process.env.APP_REVISION = 'a'.repeat(40);
  const first = GET();
  expect(first.status).toBe(200);
  expect(first.headers.get('Cache-Control')).toBe('no-store');
  expect(await first.json()).toEqual({ status: 'ok', revision: 'a'.repeat(40) });

  process.env.APP_REVISION = 'b'.repeat(40);
  expect(await GET().json()).toEqual({ status: 'ok', revision: 'b'.repeat(40) });
});

test('does not claim a deployment revision when one is not configured', async () => {
  delete process.env.APP_REVISION;
  expect(await GET().json()).toEqual({ status: 'ok', revision: 'unknown' });
});
