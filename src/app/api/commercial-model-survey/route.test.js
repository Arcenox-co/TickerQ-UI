import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import { POST } from './route.ts';

const originalFetch = globalThis.fetch;
const originalEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SURVEY_RATE_LIMIT_SECRET: process.env.SURVEY_RATE_LIMIT_SECRET,
  SURVEY_CLIENT_IP_HEADER: process.env.SURVEY_CLIENT_IP_HEADER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SURVEY_NOTIFICATION_EMAIL: process.env.SURVEY_NOTIFICATION_EMAIL,
  SURVEY_FROM_EMAIL: process.env.SURVEY_FROM_EMAIL,
};

const validSubmission = {
  usage: 'production',
  priorities: ['features'],
  response: 'agree',
  opinion: '',
  website: '',
  surveyVersion: 'test',
};

function request(body, headers = {}) {
  return new Request('https://tickerq.net/api/commercial-model-survey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': '192.0.2.1', ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.SUPABASE_URL = 'https://project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
  process.env.SURVEY_RATE_LIMIT_SECRET = 'a'.repeat(32);
  process.env.SURVEY_CLIENT_IP_HEADER = 'x-real-ip';
  delete process.env.RESEND_API_KEY;
  delete process.env.SURVEY_NOTIFICATION_EMAIL;
  delete process.env.SURVEY_FROM_EMAIL;
  globalThis.fetch = mock(() =>
    Promise.resolve(new Response(JSON.stringify('00000000-0000-0000-0000-000000000001'))),
  );
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe('commercial survey route', () => {
  test('stores a valid submission', async () => {
    const response = await POST(request(validSubmission));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  test('keeps a successful save successful when the Supabase body is malformed', async () => {
    globalThis.fetch = mock(() => Promise.resolve(new Response('not-json')));
    const response = await POST(request(validSubmission));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
  });

  test('rejects a filled honeypot instead of reporting a saved response', async () => {
    const response = await POST(request({ ...validSubmission, website: 'filled' }));
    expect(response.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test('rejects a streaming body larger than 16 KiB', async () => {
    const response = await POST(request({ ...validSubmission, opinion: 'x'.repeat(20_000) }));
    expect(response.status).toBe(413);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test('fails closed when the trusted proxy header is absent', async () => {
    const response = await POST(
      new Request('https://tickerq.net/api/commercial-model-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validSubmission),
      }),
    );
    expect(response.status).toBe(503);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
