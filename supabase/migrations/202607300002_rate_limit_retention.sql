-- Keep pseudonymous rate-limit keys only as long as they are useful.

create index if not exists commercial_model_rate_limits_window_idx
  on public.commercial_model_rate_limits (window_started_at);

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

  delete from public.commercial_model_rate_limits
  where window_started_at < now() - interval '24 hours';

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
