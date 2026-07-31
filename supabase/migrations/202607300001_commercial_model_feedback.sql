-- TickerQ commercial-model survey storage and database-backed rate limiting.
-- Apply this migration in the Supabase SQL editor or with `supabase db push`.

create extension if not exists pgcrypto;

create table if not exists public.commercial_model_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  survey_version text not null check (char_length(survey_version) between 1 and 40),
  usage text not null check (usage in ('production', 'pilot', 'evaluating', 'not-yet')),
  priorities text[] not null check (
    cardinality(priorities) between 1 and 3
    and priorities <@ array['features', 'fixes', 'integrations', 'reliability', 'dashboard', 'docs']::text[]
  ),
  response text not null check (response in ('agree', 'opinion')),
  opinion text check (
    char_length(coalesce(opinion, '')) <= 4000
    and (response = 'agree' or nullif(btrim(opinion), '') is not null)
  )
);

create index if not exists commercial_model_feedback_created_at_idx
  on public.commercial_model_feedback (created_at desc);

alter table public.commercial_model_feedback enable row level security;
revoke all on public.commercial_model_feedback from anon, authenticated;

create table if not exists public.commercial_model_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null,
  submission_count integer not null check (submission_count > 0)
);

alter table public.commercial_model_rate_limits enable row level security;
revoke all on public.commercial_model_rate_limits from anon, authenticated;

create or replace function public.submit_commercial_model_feedback(
  p_rate_key text,
  p_survey_version text,
  p_usage text,
  p_priorities text[],
  p_response text,
  p_opinion text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_limit public.commercial_model_rate_limits%rowtype;
  feedback_id uuid;
begin
  if char_length(p_rate_key) <> 64 then
    raise exception using errcode = '22023', message = 'invalid_rate_key';
  end if;

  select * into current_limit
  from public.commercial_model_rate_limits
  where key_hash = p_rate_key
  for update;

  if not found then
    insert into public.commercial_model_rate_limits (
      key_hash,
      window_started_at,
      submission_count
    ) values (p_rate_key, now(), 1);
  elsif current_limit.window_started_at <= now() - interval '10 minutes' then
    update public.commercial_model_rate_limits
    set window_started_at = now(), submission_count = 1
    where key_hash = p_rate_key;
  elsif current_limit.submission_count >= 5 then
    raise exception using errcode = 'P0001', message = 'rate_limit_exceeded';
  else
    update public.commercial_model_rate_limits
    set submission_count = submission_count + 1
    where key_hash = p_rate_key;
  end if;

  insert into public.commercial_model_feedback (
    survey_version,
    usage,
    priorities,
    response,
    opinion
  ) values (
    p_survey_version,
    p_usage,
    p_priorities,
    p_response,
    nullif(btrim(p_opinion), '')
  )
  returning id into feedback_id;

  return feedback_id;
end;
$$;

revoke all on function public.submit_commercial_model_feedback(text, text, text, text[], text, text) from public, anon, authenticated;
grant execute on function public.submit_commercial_model_feedback(text, text, text, text[], text, text) to service_role;

comment on table public.commercial_model_feedback is
  'Anonymous responses to the TickerQ commercial-model survey.';
comment on table public.commercial_model_rate_limits is
  'Short-lived HMAC rate-limit keys. Contains no raw IP addresses.';
