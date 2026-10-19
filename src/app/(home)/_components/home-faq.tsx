import Link from "next/link";
import { ChevronDown } from "lucide-react";

const linkClass = "font-medium text-teal-700 underline decoration-teal-700/30 underline-offset-4 hover:decoration-current focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:text-teal-400 dark:decoration-teal-400/30";

const questions = [
  {
    question: "Do I need a separate scheduling server?",
    answer: (
      <>
        No. TickerQ runs inside your ASP.NET Core application or .NET worker service,
        using your existing dependency injection. You can also separate your job
        producers and workers around a shared persistent store. See {" "}
        <Link href="/docs/5.x/what-is-tickerq" className={linkClass}>how TickerQ fits together</Link>.
      </>
    ),
  },
  {
    question: "Which databases can I use?",
    answer: (
      <>
        Use <Link href="/docs/5.x/entity-framework" className={linkClass}>EF Core</Link> with
        SQL Server, PostgreSQL, or SQLite, or choose {" "}
        <Link href="/docs/5.x/mongodb" className={linkClass}>MongoDB</Link> or {" "}
        <Link href="/docs/5.x/redis" className={linkClass}>Redis</Link>.
        In-memory storage is available for local development; it does not retain
        jobs across process restarts.
      </>
    ),
  },
  {
    question: "Can my company use TickerQ for free?",
    answer: (
      <>
        Eligible companies with consolidated gross revenue below $5M USD qualify
        for a free Community license. Eligible individuals, nonprofits, and
        educational users can qualify too. The agreement’s control-group rules
        apply, and eligibility is reassessed annually. Read the {" "}
        <Link href="/docs/5.x/getting-started/licensing" className={linkClass}>licensing guide</Link> before choosing a plan.
      </>
    ),
  },
  {
    question: "How do I upgrade from an earlier release?",
    answer: (
      <>
        Follow the <Link href="/docs/5.x/getting-started/migration" className={linkClass}>5.x upgrade guide</Link> for
        certificate setup, API changes, and storage migrations. Test against a
        copy of your data before rollout; updating the packages does not migrate
        an existing database. Earlier artifacts keep their original license terms.
      </>
    ),
  },
  {
    question: "Do I have to use AI or connect external services?",
    answer: (
      <>
        No. The scheduler and dashboard run in your application. The {" "}
        <Link href="/docs/5.x/dashboard/ai-assistant" className={linkClass}>AI assistant</Link> uses
        a model provider you configure, and sends it the runtime data inspected
        during a conversation. {" "}
        <Link href="/docs/5.x/integrations" className={linkClass}>Slack, Teams, and webhook integrations</Link> are
        optional too.
      </>
    ),
  },
];

export function HomeFaq() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="faq-heading">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Common questions</p>
          <h2 id="faq-heading" className="mt-4 max-w-sm text-3xl font-semibold tracking-tight sm:text-4xl">Before you get started.</h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-fd-muted-foreground">A few practical details about running TickerQ in your application.</p>
        </div>
        <div className="divide-y divide-fd-border border-y border-fd-border">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-medium transition-colors hover:text-teal-700 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:hover:text-teal-400 [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <ChevronDown className="size-4 shrink-0 text-fd-muted-foreground transition-transform motion-reduce:transition-none group-open:rotate-180 group-open:text-teal-700 dark:group-open:text-teal-400" aria-hidden />
              </summary>
              <p className="pb-6 pr-2 text-sm leading-7 text-fd-muted-foreground sm:pr-9">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
