import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Ban, BellRing, CalendarClock, Check, CheckCheck, CircleAlert, Clock3, Database, FileText, GitBranch, GitCommitHorizontal, Mail, ShoppingBag, Webhook } from 'lucide-react';

const diagramClass = 'relative flex h-64 items-center justify-center overflow-hidden border-b border-fd-border bg-fd-muted/30 px-5 sm:px-6';
const nodeClass = 'flex items-center gap-3 rounded-lg border border-fd-border bg-fd-background px-3.5 py-3 shadow-sm';

function WorkflowDiagram() {
  return (
    <div role="img" aria-label="Example: Create invoice finishes and passes invoice ID INV-1042 to the queued Email customer step." className={diagramClass}>
      <div aria-hidden="true" className="w-full max-w-72">
        <div className={nodeClass}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-400"><FileText className="size-4" /></span>
          <span className="text-xs font-medium">Create invoice</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-teal-700 dark:text-teal-400"><Check className="size-3.5" />Done</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 w-px bg-teal-600/30 dark:bg-teal-400/30" />
          <div className="flex items-center gap-2 rounded-md border border-teal-600/20 bg-teal-500/5 px-3 py-1.5 text-[11px]">
            <GitBranch className="size-3.5 text-teal-700 dark:text-teal-400" />
            <code className="text-fd-muted-foreground">invoiceId: <span className="text-fd-foreground">&quot;INV-1042&quot;</span></code>
          </div>
          <ArrowDown className="my-1 size-4 text-teal-700/70 dark:text-teal-400/70" />
        </div>
        <div className={nodeClass}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-fd-muted text-fd-muted-foreground"><Mail className="size-4" /></span>
          <span className="text-xs font-medium">Email customer</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-fd-muted-foreground"><Clock3 className="size-3.5" />Queued</span>
        </div>
      </div>
    </div>
  );
}

function TransactionDiagram() {
  return (
    <div role="img" aria-label="Example: An order record and a staged invoice job are saved in the same EF Core database transaction. Both commit, or neither does." className={diagramClass}>
      <div aria-hidden="true" className="w-full max-w-72">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-2 py-4 shadow-sm">
            <ShoppingBag className="size-5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-medium">Order record</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-2 py-4 shadow-sm">
            <FileText className="size-5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-medium">Invoice job</span>
          </div>
        </div>
        <div className="relative mx-auto h-7 w-[calc(50%+0.375rem)] rounded-b-lg border-x border-b border-violet-500/35">
          <span className="absolute -bottom-5 left-1/2 h-5 w-px -translate-x-1/2 bg-violet-500/35" />
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-3 text-xs font-semibold">
          <Database className="size-4 text-violet-600 dark:text-violet-400" />
          One database commit
          <CheckCheck className="size-4 text-violet-600 dark:text-violet-400" />
        </div>
        <p className="mt-3 text-center text-[11px] text-fd-muted-foreground">Both saved. Or neither.</p>
      </div>
    </div>
  );
}

const policyDays = [
  { day: 'Mon', allowed: true }, { day: 'Tue', allowed: true }, { day: 'Wed', allowed: true },
  { day: 'Thu', allowed: true }, { day: 'Fri', allowed: true }, { day: 'Sat', allowed: false }, { day: 'Sun', allowed: false },
];

function PolicyDiagram() {
  return (
    <div role="img" aria-label="Example: The Payments settlement policy allows weekdays from 08:00 to 18:00, requires Business hours, and is blocked during the maintenance window. A job requested for Saturday 09:00 moves to Monday 08:00." className={diagramClass}>
      <div aria-hidden="true" className="w-full max-w-72">
        <div className="rounded-lg border border-fd-border bg-fd-background px-4 py-3 shadow-sm">
          <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold"><CalendarClock className="size-3.5 text-sky-700 dark:text-sky-400" />Payments settlement<span className="ml-auto font-normal text-fd-muted-foreground">08:00–18:00</span></p>
          <div className="grid grid-cols-7 gap-1">
            {policyDays.map(({ day, allowed }) => (
              <span key={day} className={`rounded border py-0.5 text-center text-[10px] font-medium ${allowed ? 'border-sky-600/30 bg-sky-500/10 text-sky-800 dark:text-sky-300' : 'border-fd-border text-fd-muted-foreground/60 line-through'}`}>{day}</span>
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] font-medium">
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-600/30 bg-teal-500/10 px-2 py-0.5 text-teal-800 dark:text-teal-300"><Check className="size-3" />Requires Business hours</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-600/30 bg-rose-500/10 px-2 py-0.5 text-rose-700 dark:text-rose-300"><Ban className="size-3" />Except maintenance</span>
          </div>
        </div>
        <div className="mx-auto h-4 w-px bg-fd-border" />
        <div className="flex items-center justify-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2.5 text-[11px]">
          <span className="text-fd-muted-foreground line-through">Sat 09:00</span>
          <ArrowRight className="size-3.5 text-sky-700 dark:text-sky-400" />
          <span className="font-semibold">Mon 08:00</span>
          <span className="text-fd-muted-foreground">moved forward</span>
        </div>
      </div>
    </div>
  );
}

function MonitoringDiagram() {
  return (
    <div role="img" aria-label="Example: Daily invoices miss the 08:00 deadline and recover at 08:12. Alerts and recovery updates can be sent to Slack, Microsoft Teams, or a webhook." className={diagramClass}>
      <div aria-hidden="true" className="w-full max-w-72">
        <div className="rounded-lg border border-fd-border bg-fd-background px-4 py-3 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold"><BellRing className="size-3.5 text-fd-muted-foreground" />Daily invoices</p>
          <div className="relative space-y-3 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-fd-border">
            <div className="relative flex items-center gap-2 text-[11px]"><CircleAlert className="size-4 shrink-0 bg-fd-background text-amber-700 dark:text-amber-400" /><span className="text-fd-muted-foreground">08:00</span><span>Deadline missed</span></div>
            <div className="relative flex items-center gap-2 text-[11px]"><span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white dark:bg-teal-400 dark:text-neutral-950"><Check className="size-3" /></span><span className="text-fd-muted-foreground">08:12</span><span>Recovered</span></div>
          </div>
        </div>
        <div className="mx-auto h-4 w-px bg-fd-border" />
        <div className="relative mx-auto h-3 w-2/3 rounded-t-lg border-x border-t border-fd-border"><span className="absolute left-1/2 top-0 h-3 w-px bg-fd-border" /></div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1.5"><span className="flex size-10 items-center justify-center rounded-xl border border-fd-border bg-fd-background shadow-sm"><Image src="/images/integrations/slack.svg" width={22} height={22} alt="" /></span><span className="text-[10px] text-fd-muted-foreground">Slack</span></div>
          <div className="flex flex-col items-center gap-1.5"><span className="flex size-10 items-center justify-center rounded-xl border border-fd-border bg-fd-background shadow-sm"><Image src="/images/integrations/microsoft-teams.svg" width={24} height={23} alt="" /></span><span className="text-[10px] text-fd-muted-foreground">Microsoft Teams</span></div>
          <div className="flex flex-col items-center gap-1.5"><span className="flex size-10 items-center justify-center rounded-xl border border-fd-border bg-fd-background shadow-sm"><Webhook className="size-5 text-fd-muted-foreground" /></span><span className="text-[10px] text-fd-muted-foreground">Webhooks</span></div>
        </div>
      </div>
    </div>
  );
}

const capabilities = [
  {
    category: 'Workflows', icon: GitBranch, diagram: WorkflowDiagram,
    title: 'Keep every step connected.',
    description: 'Pass results from parent to child and follow each step’s status and logs. Recurring workflows start a fresh chain on every run.',
    href: '/docs/5.x/guides/recurring-chains', link: 'Explore job chains',
  },
  {
    category: 'Transactional scheduling', icon: GitCommitHorizontal, diagram: TransactionDiagram,
    title: 'Save the change. And the job.',
    description: 'Stage a job in your application’s EF Core context. Commit it with your business data in the same database transaction.',
    href: '/docs/5.x/entity-framework/transactional-scheduling', link: 'See how staging works',
  },
  {
    category: 'Schedule policies', icon: CalendarClock, diagram: PolicyDiagram,
    title: 'Run only when the business allows.',
    description: 'Define business hours, holidays, and maintenance windows once. Cron runs outside a policy are skipped, and one-time jobs can move to the next allowed time.',
    href: '/docs/5.x/guides/schedule-policies/business-calendars', link: 'Define a business calendar',
  },
  {
    category: 'Monitoring & integrations', icon: BellRing, diagram: MonitoringDiagram,
    title: 'Keep your team in the loop.',
    description: 'Watch deadlines, repeated failures, and long runs. Choose functions, destinations, and recovery updates in the dashboard.',
    href: '/docs/5.x/integrations/monitoring', link: 'Set up monitoring',
  },
];

export function HomeCapabilities() {
  return (
    <section className="border-y border-fd-border bg-fd-muted/15" aria-labelledby="capabilities-heading">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-9 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">Built around real application work</p>
            <h2 id="capabilities-heading" className="mt-3 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">From scheduling to knowing it’s done.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-fd-muted-foreground">Connect the steps, keep jobs with your business data, run them only when your calendar allows, and let the right people know when work needs attention.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {capabilities.map(({ category, icon: Icon, diagram: Diagram, title, description, href, link }) => (
            <article key={category} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-background">
              <Diagram />
              <div className="flex flex-1 flex-col p-6 max-[359px]:p-5">
                <p className="mb-3 flex items-center gap-2 text-xs font-medium text-fd-muted-foreground"><Icon className="size-3.5 shrink-0" aria-hidden />{category}</p>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">{description}</p>
                <Link href={href} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-6 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline dark:text-teal-400">{link}<ArrowRight className="size-4 shrink-0" aria-hidden /></Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-fd-muted-foreground">Illustrative examples. Monitoring and message delivery use the optional TickerQ.Integrations package.</p>
      </div>
    </section>
  );
}
