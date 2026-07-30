'use client';

import Image from 'next/image';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { cn } from '@/lib/cn';
import { appName } from '@/lib/shared';

type Choice = { value: string; label: string; description?: string };
type Answers = Record<string, string>;

type Step = {
  id: string;
  label: string;
  title: string;
};

const STEPS: Step[] = [
  { id: 'overview', label: 'Why now', title: 'Help make TickerQ sustainable' },
  { id: 'usage', label: 'Your use', title: 'How are you using TickerQ?' },
  { id: 'priorities', label: 'Priorities', title: 'Where should more funding go first?' },
  { id: 'proposal', label: 'Pricing', title: 'How does the proposed pricing feel?' },
];

const LAST_STEP = STEPS.length - 1;
const cardClass =
  'rounded-2xl border border-platinum/80 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900/60';

const USAGE_OPTIONS: Choice[] = [
  { value: 'production', label: 'In production' },
  { value: 'pilot', label: 'Pilot or staging' },
  { value: 'evaluating', label: 'Evaluating it' },
  { value: 'not-yet', label: 'Not using it yet' },
];

const PRIORITIES: Choice[] = [
  {
    value: 'features',
    label: 'More features, faster',
    description: 'Ship the most-requested capabilities with shorter lead times.',
  },
  {
    value: 'fixes',
    label: 'Faster fixes and releases',
    description: 'Spend less time waiting for bugs, regressions and compatibility issues.',
  },
  {
    value: 'integrations',
    label: 'More integrations',
    description: 'Support more databases, hosting models and .NET ecosystems.',
  },
  {
    value: 'reliability',
    label: 'Production reliability',
    description: 'Invest more time in testing, performance and operational safety.',
  },
  {
    value: 'dashboard',
    label: 'A stronger dashboard',
    description: 'Improve monitoring, administration and team workflows.',
  },
  {
    value: 'docs',
    label: 'Better docs and examples',
    description: 'Make adoption and troubleshooting easier for every team.',
  },
];

const RESPONSE_OPTIONS: Choice[] = [
  { value: 'agree', label: 'I agree with this proposal' },
  { value: 'opinion', label: 'I have a different opinion' },
];

const PROPOSAL = [
  {
    name: 'Community',
    price: 'Free',
    summary: 'Free for personal projects, education, nonprofits, open-source projects, and organizations under $5M annual revenue.',
  },
  {
    name: 'Business',
    price: '$499 /yr',
    summary: 'A commercial Core licence for organizations with $5M+ annual revenue, covering unlimited developers, apps and deployments.',
    highlight: true,
  },
  {
    name: 'Priority',
    price: '$1,499 /yr',
    summary: 'Business plus private support, priority triage and long-term support.',
  },
  {
    name: 'Enterprise',
    price: 'From $4,500 /yr',
    summary: 'Priority plus an SLA, invoicing, custom terms and procurement support.',
  },
];

const COMMITMENTS = [
  'Personal projects, education, nonprofits, open-source projects, and organizations under $5M annual revenue use TickerQ Core free.',
  'Only organizations with $5M+ annual revenue require a commercial Core licence.',
  'Existing MIT / Apache releases remain free permanently.',
  'Paid plans fund faster fixes, features and long-term maintenance.',
  'One organization licence covers unlimited developers, apps and deployments.',
  'Licensed versions keep working after renewal ends.',
  'Offline checks never block or delay scheduled jobs.',
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-slate dark:text-lavender-grey">
      {children}
    </p>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function RadioGroup({
  legend,
  help,
  name,
  options,
  value,
  onChange,
  required,
  invalid,
}: {
  legend: string;
  help?: string;
  name: string;
  options: Choice[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <fieldset data-invalid={invalid || undefined}>
      <legend className="text-base font-semibold text-deep-navy dark:text-ghost-white">
        {legend}
        {required ? (
          <span className="ml-1 text-brand" aria-hidden>
            *
          </span>
        ) : null}
      </legend>
      {help ? (
        <p className="mt-1.5 text-sm leading-relaxed text-blue-slate dark:text-lavender-grey">
          {help}
        </p>
      ) : null}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {options.map((option, index) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand',
                checked
                  ? 'border-brand bg-brand/[0.06] text-deep-navy dark:text-ghost-white'
                  : invalid
                    ? 'border-red-400/70 text-blue-slate dark:text-lavender-grey'
                    : 'border-platinum/80 text-blue-slate hover:border-lavender-grey dark:border-white/10 dark:text-lavender-grey',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
                data-first={index === 0 || undefined}
              />
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                  checked ? 'border-brand' : 'border-pale-slate dark:border-white/25',
                )}
                aria-hidden
              >
                <span
                  className={cn(
                    'size-2.5 rounded-full bg-brand transition-transform',
                    checked ? 'scale-100' : 'scale-0',
                  )}
                />
              </span>
              <span className="font-medium leading-snug">{option.label}</span>
            </label>
          );
        })}
      </div>
      {invalid ? (
        <p className="mt-2.5 text-sm font-medium text-red-500">
          Please choose an option to continue.
        </p>
      ) : null}
    </fieldset>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-base font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        rows={6}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full resize-y rounded-xl border border-platinum/80 bg-white px-4 py-3 text-sm leading-relaxed text-deep-navy shadow-sm placeholder:text-lavender-grey focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-white/10 dark:bg-neutral-900/50 dark:text-ghost-white"
      />
    </div>
  );
}

function Stepper({
  current,
  completed,
  reachable,
  onGo,
}: {
  current: number;
  completed: boolean;
  reachable: (index: number) => boolean;
  onGo: (index: number) => void;
}) {
  const progress = completed ? 100 : Math.round((current / LAST_STEP) * 100);

  return (
    <div className="sticky top-14 z-30 border-b border-platinum/60 bg-fd-background/90 backdrop-blur-md dark:border-white/10">
      <div className="mx-auto w-full max-w-3xl px-4 py-3.5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            {completed ? 'Survey complete' : `Step ${current + 1} of ${STEPS.length}`}
            <span className="ml-2 font-normal text-blue-slate dark:text-lavender-grey">
              {completed ? 'Feedback saved' : STEPS[current].label}
            </span>
          </p>
          <p className="text-sm tabular-nums text-blue-slate dark:text-lavender-grey">
            {progress}%
          </p>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-platinum/70 dark:bg-white/10"
          role="progressbar"
          aria-valuenow={completed ? STEPS.length : current + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <nav aria-label="Survey steps" className="mt-3 hidden sm:block">
          <ol className="flex items-center justify-between gap-2">
            {STEPS.map((item, index) => {
              const canGo = !completed && reachable(index);
              const active = !completed && index === current;
              const complete = completed || (index < current && canGo);
              return (
                <li key={item.id} className="flex flex-1 items-center last:flex-none">
                  <button
                    type="button"
                    onClick={() => canGo && !active && onGo(index)}
                    disabled={!canGo || active}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`Step ${index + 1}: ${item.label}`}
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                      active
                        ? 'border-brand bg-brand text-white'
                        : complete
                          ? 'border-brand/40 bg-brand/10 text-brand'
                          : canGo
                            ? 'border-platinum bg-white text-blue-slate dark:border-white/15 dark:bg-neutral-900 dark:text-lavender-grey'
                            : 'cursor-not-allowed border-platinum/60 text-pale-slate dark:border-white/10 dark:text-white/30',
                    )}
                  >
                    {complete ? <CheckIcon className="size-3.5" /> : index + 1}
                  </button>
                  {index < LAST_STEP ? (
                    <span
                      className={cn(
                        'mx-2 h-px flex-1',
                        completed || index < current
                          ? 'bg-brand/40'
                          : 'bg-platinum/70 dark:bg-white/10',
                      )}
                      aria-hidden
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

function NavControls({
  onBack,
  continueLabel = 'Continue',
}: {
  onBack: () => void;
  continueLabel?: string;
}) {
  return (
    <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[48px] rounded-full border border-platinum/80 bg-white px-6 py-3 text-sm font-semibold dark:border-white/15 dark:bg-neutral-900/60"
      >
        ← Back
      </button>
      <button
        type="submit"
        className="min-h-[48px] rounded-full bg-gradient-to-b from-deep-navy to-space-indigo px-8 py-3 text-sm font-semibold text-bright-snow shadow-lg"
      >
        {continueLabel} →
      </button>
    </div>
  );
}

export function CommercialModelSurvey() {
  const [answers, setAnswers] = useState<Answers>({});
  const [priorities, setPriorities] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [website, setWebsite] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const setAnswer = (id: string, value: string) => {
    setFinished(false);
    setShowErrors(false);
    setSubmitError('');
    setAnswers((previous) => ({ ...previous, [id]: value }));
  };

  const isComplete = useCallback(
    (index: number) => {
      if (index === 1) return Boolean(answers.usage);
      if (index === 2) return priorities.length > 0;
      if (index === 3) {
        return answers.response === 'agree'
          || (answers.response === 'opinion' && Boolean(answers.opinion?.trim()));
      }
      return true;
    },
    [answers, priorities],
  );

  const isReachable = useCallback(
    (index: number) => {
      for (let cursor = 0; cursor < index; cursor += 1) {
        if (!isComplete(cursor)) return false;
      }
      return true;
    },
    [isComplete],
  );

  const focusPanel = useCallback(() => {
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      panelRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setShowErrors(false);
      setFinished(false);
      setStep(index);
      focusPanel();
    },
    [focusPanel],
  );

  const continueForward = () => {
    if (!isComplete(step)) {
      setShowErrors(true);
      requestAnimationFrame(() => {
        panelRef.current
          ?.querySelector<HTMLElement>('[data-invalid="true"] input')
          ?.focus();
      });
      return;
    }
    if (step < LAST_STEP) goTo(step + 1);
  };

  const submitFeedback = async () => {
    if (!isComplete(step)) {
      setShowErrors(true);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/commercial-model-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usage: answers.usage,
          priorities,
          response: answers.response,
          opinion: answers.opinion ?? '',
          website,
          surveyVersion: '2026-07-30',
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? 'Unable to submit feedback');
      }

      setFinished(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to submit feedback',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const togglePriority = (value: string) => {
    setPriorities((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : current.length < 3
          ? [...current, value]
          : current,
    );
  };

  const heading = (supporting: ReactNode) => (
    <>
      <SectionLabel>
        Step {step + 1} of {STEPS.length}
      </SectionLabel>
      <h1
        id="panel-heading"
        className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
      >
        {STEPS[step].title}
      </h1>
      <div className="mt-2 text-sm leading-relaxed text-blue-slate dark:text-lavender-grey">
        {supporting}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-fd-background text-deep-navy dark:text-ghost-white">
      <header className="sticky top-0 z-40 border-b border-platinum/70 bg-fd-background/85 backdrop-blur-md dark:border-white/10">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/tickerq-logo.svg"
              width={24}
              height={24}
              sizes="24px"
              alt=""
              className="size-6"
              unoptimized
            />
            <span className="font-semibold tracking-tight">{appName}</span>
            <span className="ml-1 hidden rounded-full border border-platinum/80 px-2.5 py-1 text-[11px] font-medium text-blue-slate dark:border-white/10 dark:text-lavender-grey sm:inline">
              Community feedback
            </span>
          </div>
          <AnimatedThemeToggler className="border-platinum/80 dark:border-white/15" />
        </div>
      </header>

      <Stepper
        current={step}
        completed={finished}
        reachable={isReachable}
        onGo={goTo}
      />

      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (step === LAST_STEP) await submitFeedback();
            else continueForward();
          }}
        >
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
          <div
            ref={panelRef}
            tabIndex={-1}
            aria-labelledby="panel-heading"
            className="scroll-mt-32 focus:outline-none"
          >
            {step === 0 ? (
              <>
                <SectionLabel>A note from the developer</SectionLabel>
                <h1
                  id="panel-heading"
                  className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Help make TickerQ sustainable
                </h1>
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-blue-slate dark:text-lavender-grey">
                  <p>
                    TickerQ is built and maintained by one developer. Every issue,
                    feature, integration, release, support request and piece of
                    documentation currently competes for the same limited time.
                  </p>
                  <p>
                    The goal of a commercial offering is not to take the scheduler
                    away from the community. It is to fund focused development so
                    TickerQ can fix problems faster, ship more features and become a
                    stronger long-term choice for production teams.
                  </p>
                </div>

                <div className={cn(cardClass, 'mt-8 p-6')}>
                  <h2 className="font-semibold">The direction being considered</h2>
                  <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-blue-slate dark:text-lavender-grey">
                    <li className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                      TickerQ Core stays free for personal projects, education,
                      nonprofits, open-source projects, and organizations under
                      $5M annual revenue.
                    </li>
                    <li className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                      Organizations with $5M+ annual revenue purchase a commercial
                      licence that funds continued work.
                    </li>
                    <li className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                      Funding goes back into faster fixes, features and reliability.
                    </li>
                  </ul>
                </div>

                <p className="mt-5 text-sm text-blue-slate dark:text-lavender-grey">
                  Three short questions · about two minutes · no names required.
                </p>
                <div className="mt-4 rounded-xl border border-platinum/70 bg-ghost-white-2/50 px-4 py-3 text-sm leading-relaxed text-blue-slate dark:border-white/10 dark:bg-white/[0.03] dark:text-lavender-grey">
                  Responses are stored anonymously for product research. We do not
                  ask for names, email addresses or company details, and raw IP
                  addresses are not stored.
                </div>
                <div className="mt-9 flex justify-end">
                  <button
                    type="submit"
                    className="min-h-[48px] rounded-full bg-gradient-to-b from-deep-navy to-space-indigo px-8 py-3 text-sm font-semibold text-bright-snow shadow-lg"
                  >
                    Start →
                  </button>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                {heading(
                  'This helps us understand whether the feedback comes from production use or early evaluation.',
                )}
                <div className={cn(cardClass, 'mt-6 p-5 sm:p-6')}>
                  <RadioGroup
                    legend="Current TickerQ use"
                    name="usage"
                    options={USAGE_OPTIONS}
                    value={answers.usage}
                    onChange={(value) => setAnswer('usage', value)}
                    required
                    invalid={showErrors && !answers.usage}
                  />
                </div>
                <NavControls onBack={() => goTo(0)} />
              </>
            ) : null}

            {step === 2 ? (
              <>
                {heading(
                  'Choose up to three areas where dedicated development time would make the biggest difference.',
                )}
                <fieldset
                  data-invalid={(showErrors && priorities.length === 0) || undefined}
                  className={cn(cardClass, 'mt-6 p-5 sm:p-6')}
                >
                  <legend className="text-base font-semibold">
                    Development priorities{' '}
                    <span className="text-brand" aria-hidden>
                      *
                    </span>
                  </legend>
                  <p className="mt-1.5 text-sm text-blue-slate dark:text-lavender-grey">
                    {priorities.length} of 3 selected
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {PRIORITIES.map((option) => {
                      const checked = priorities.includes(option.value);
                      const disabled = !checked && priorities.length >= 3;
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            'flex min-h-[76px] gap-3 rounded-xl border px-4 py-3.5',
                            checked
                              ? 'border-brand bg-brand/[0.06]'
                              : 'border-platinum/80 dark:border-white/10',
                            disabled
                              ? 'cursor-not-allowed opacity-45'
                              : 'cursor-pointer',
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => togglePriority(option.value)}
                            className="mt-0.5 size-4 accent-[hsl(var(--brand))]"
                          />
                          <span>
                            <span className="block text-sm font-semibold">
                              {option.label}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-blue-slate dark:text-lavender-grey">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {showErrors && priorities.length === 0 ? (
                    <p className="mt-3 text-sm font-medium text-red-500">
                      Choose at least one priority to continue.
                    </p>
                  ) : null}
                </fieldset>
                <NavControls onBack={() => goTo(1)} />
              </>
            ) : null}

            {step === 3 ? (
              finished ? (
                <section
                  role="status"
                  className="flex min-h-[58vh] flex-col items-center justify-center py-12 text-center"
                >
                  <span className="flex size-20 items-center justify-center rounded-full bg-brand/10 text-brand ring-8 ring-brand/[0.04]">
                    <CheckIcon className="size-10" />
                  </span>
                  <SectionLabel>Survey complete</SectionLabel>
                  <h1
                    id="panel-heading"
                    className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                  >
                    Thank you for your feedback
                  </h1>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-blue-slate dark:text-lavender-grey">
                    Your response was saved successfully. It will help prioritize
                    TickerQ development and shape a sustainable commercial model.
                  </p>
                  <a
                    href="/"
                    className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-gradient-to-b from-deep-navy to-space-indigo px-8 py-3 text-sm font-semibold text-bright-snow shadow-lg"
                  >
                    Return to TickerQ
                  </a>
                </section>
              ) : (
              <>
                {heading(
                  'Community use and organizations under $5M annual revenue stay free. Larger organizations licence Core and can add support or enterprise terms.',
                )}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {PROPOSAL.map((plan) => (
                    <div
                      key={plan.name}
                      className={cn(
                        cardClass,
                        'p-5',
                        plan.highlight && 'ring-1 ring-brand/40',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="font-semibold">{plan.name}</h2>
                        {plan.highlight ? (
                          <span className="rounded-full bg-brand/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                            Proposed
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-2xl font-bold">{plan.price}</p>
                      <p className="mt-3 text-sm leading-relaxed text-blue-slate dark:text-lavender-grey">
                        {plan.summary}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={cn(cardClass, 'mt-4 p-5 sm:p-6')}>
                  <h2 className="font-semibold">Commitments</h2>
                  <ul className="mt-3 space-y-2">
                    {COMMITMENTS.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-blue-slate dark:text-lavender-grey"
                      >
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={cn(cardClass, 'mt-4 p-5 sm:p-6')}>
                  <RadioGroup
                    legend="Do you agree with this proposal?"
                    name="response"
                    options={RESPONSE_OPTIONS}
                    value={answers.response}
                    onChange={(value) => setAnswer('response', value)}
                    required
                    invalid={showErrors && !answers.response}
                  />
                  {answers.response === 'opinion' ? (
                    <div className="mt-6 border-t border-platinum/70 pt-6 dark:border-white/10">
                      <TextArea
                        id="opinion"
                        label="Share your opinion"
                        value={answers.opinion}
                        onChange={(value) => setAnswer('opinion', value)}
                      />
                      {showErrors && !answers.opinion?.trim() ? (
                        <p className="mt-2 text-sm font-medium text-red-500">
                          Please share your opinion to finish.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {submitError ? (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200"
                  >
                    {submitError}
                  </p>
                ) : null}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="min-h-[48px] rounded-full border border-platinum/80 px-6 py-3 text-sm font-semibold dark:border-white/15"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="min-h-[48px] rounded-full bg-gradient-to-b from-deep-navy to-space-indigo px-8 py-3 text-sm font-semibold text-bright-snow shadow-lg disabled:cursor-wait disabled:opacity-60"
                  >
                    {submitting ? 'Submitting…' : 'Submit feedback'}
                  </button>
                </div>
              </>
              )
            ) : null}
          </div>
        </form>

        <footer className="mt-16 border-t border-platinum/60 pt-6 text-xs leading-relaxed text-blue-slate dark:border-white/10 dark:text-lavender-grey">
          Anonymous TickerQ commercial-model research. Responses are used only to
          evaluate funding and development priorities.
        </footer>
      </main>
    </div>
  );
}
