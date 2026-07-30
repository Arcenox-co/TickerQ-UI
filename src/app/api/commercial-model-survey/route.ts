import { createHmac } from 'node:crypto';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { parseSurveySubmission } from '@/lib/commercial-model-survey';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16_384;

function clientAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

function rateKey(request: Request, secret: string): string {
  return createHmac('sha256', secret).update(clientAddress(request)).digest('hex');
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
  if (!supabaseUrl || !serviceRoleKey || !rateLimitSecret) {
    console.error('Commercial survey storage is not configured');
    return NextResponse.json(
      { error: 'Feedback collection is temporarily unavailable' },
      { status: 503 },
    );
  }

  try {
    const submission = parseSurveySubmission(await request.json());

    // Silently accept honeypot submissions so bots receive no useful signal.
    if (submission.isBot) return NextResponse.json({ ok: true }, { status: 202 });

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
          p_rate_key: rateKey(request, rateLimitSecret),
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

    const id = (await storageResponse.json()) as string;
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

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid survey submission' }, { status: 400 });
    }
    console.error('Commercial survey submission failed', error);
    return NextResponse.json({ error: 'Unable to save feedback' }, { status: 500 });
  }
}
