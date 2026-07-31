import { createHmac } from 'node:crypto';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { parseSurveySubmission } from '@/lib/commercial-model-survey';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16_384;
const NOTIFICATION_TIMEOUT_MS = 3_000;
const TRUSTED_IP_HEADERS = new Set([
  'cf-connecting-ip',
  'fly-client-ip',
  'true-client-ip',
  'x-real-ip',
]);

class PayloadTooLargeError extends Error {}

async function readJsonBody(request: Request): Promise<unknown> {
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(body));
}

function clientAddress(request: Request, headerName: string): string | null {
  const hostname = new URL(request.url).hostname;
  if (
    process.env.NODE_ENV !== 'production'
    && (hostname === 'localhost' || hostname === '127.0.0.1')
  ) {
    return '127.0.0.1';
  }
  return request.headers.get(headerName)?.trim() || null;
}

async function notifyOwner(input: {
  id: string;
  usage: string;
  priorities: string[];
  response: string;
  opinion: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SURVEY_NOTIFICATION_EMAIL;
  const from = process.env.SURVEY_FROM_EMAIL;
  if (!apiKey || !to || !from) return;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `TickerQ survey: ${input.response === 'agree' ? 'agreement' : 'new opinion'}`,
      text: [
        `Response ID: ${input.id}`,
        `Usage: ${input.usage}`,
        `Priorities: ${input.priorities.join(', ')}`,
        `Response: ${input.response}`,
        input.opinion ? `Opinion: ${input.opinion}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    }),
    signal: AbortSignal.timeout(NOTIFICATION_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Resend notification failed with ${response.status}`);
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Submission is too large' }, { status: 413 });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const rateLimitSecret = process.env.SURVEY_RATE_LIMIT_SECRET;
  const clientIpHeader = process.env.SURVEY_CLIENT_IP_HEADER?.toLowerCase();
  if (
    !supabaseUrl
    || !serviceRoleKey
    || !rateLimitSecret
    || rateLimitSecret.length < 32
    || !clientIpHeader
    || !TRUSTED_IP_HEADERS.has(clientIpHeader)
  ) {
    console.error('Commercial survey storage is not configured');
    return NextResponse.json(
      { error: 'Feedback collection is temporarily unavailable' },
      { status: 503 },
    );
  }

  const address = clientAddress(request, clientIpHeader);
  if (!address) {
    console.error(`Trusted client IP header ${clientIpHeader} is missing`);
    return NextResponse.json(
      { error: 'Feedback collection is temporarily unavailable' },
      { status: 503 },
    );
  }

  try {
    const submission = parseSurveySubmission(await readJsonBody(request));

    if (submission.isBot) {
      return NextResponse.json(
        { error: 'Submission could not be verified' },
        { status: 400 },
      );
    }

    const storageResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/submit_commercial_model_feedback`,
      {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          ...(serviceRoleKey.startsWith('eyJ')
            ? { Authorization: `Bearer ${serviceRoleKey}` }
            : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_rate_key: createHmac('sha256', rateLimitSecret).update(address).digest('hex'),
          p_survey_version: submission.surveyVersion,
          p_usage: submission.usage,
          p_priorities: submission.priorities,
          p_response: submission.response,
          p_opinion: submission.opinion,
        }),
        cache: 'no-store',
      },
    );

    if (!storageResponse.ok) {
      const detail = await storageResponse.text();
      if (detail.includes('rate_limit_exceeded')) {
        return NextResponse.json(
          { error: 'Too many submissions. Please try again later.' },
          { status: 429 },
        );
      }
      console.error('Supabase survey insert failed', storageResponse.status, detail);
      return NextResponse.json({ error: 'Unable to save feedback' }, { status: 502 });
    }

    let id: string | null = null;
    try {
      const result: unknown = await storageResponse.json();
      if (typeof result === 'string') id = result;
      else console.error('Supabase survey insert returned an unexpected response');
    } catch (error) {
      console.error('Supabase survey insert response could not be parsed', error);
    }

    if (id) {
      try {
        await notifyOwner({
          id,
          usage: submission.usage,
          priorities: submission.priorities,
          response: submission.response,
          opinion: submission.opinion,
        });
      } catch (error) {
        // The database is authoritative; notification failure must not lose feedback.
        console.error('Commercial survey email notification failed', error);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: 'Submission is too large' }, { status: 413 });
    }
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid survey submission' }, { status: 400 });
    }
    console.error('Commercial survey submission failed', error);
    return NextResponse.json({ error: 'Unable to save feedback' }, { status: 500 });
  }
}
