'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, CircleAlert, Clock3, Database, FileText, Send } from 'lucide-react';

const scenarios = {
  success: { label: 'On time', state: 'Done', title: 'Ready before the deadline', text: 'All three steps finished. The final step succeeded before 08:00, so no deadline incident is opened.', time: '07:15', alert: false },
  late: { label: 'Late', state: 'Failed', title: 'Deadline missed', text: 'The first two steps finished, but sending failed. The final step has no successful run by 08:00, so the configured monitor opens an incident.', time: '08:00', alert: true },
  recovery: { label: 'Recovered', state: 'Done', title: 'Recovery confirmed', text: 'A later run of the final step succeeds. With recovery messages enabled, the monitor sends an update that the deadline incident has cleared.', time: '08:12', alert: false },
} as const;
const steps = [
  { name: 'Fetch orders', functionName: 'Orders.Fetch', icon: Database },
  { name: 'Generate invoices', functionName: 'Invoices.Generate', icon: FileText },
  { name: 'Send emails', functionName: 'Invoices.Send', icon: Send },
];

export function WorkflowExample() {
  const [selected, setSelected] = useState<keyof typeof scenarios>('success');
  const scenario = scenarios[selected];
  const panelId = useId();
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="workflow-heading">
      <div className="mb-8 grid gap-4 md:grid-cols-2 md:items-end md:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">From task to workflow</p>
          <h2 id="workflow-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One schedule.<br />Every step in view.</h2>
        </div>
        <p className="max-w-lg text-base leading-7 text-fd-muted-foreground">Take a daily invoicing run. Fetch the orders, generate the invoices, then send them. Follow the whole chain and monitor the step that confirms the work is finished.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-muted/25">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fd-border px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2 text-sm"><Clock3 className="size-4 text-teal-700 dark:text-teal-400" aria-hidden /><span className="font-medium">Daily invoices</span><span className="text-fd-muted-foreground">/ 07:00</span></div>
          <p className="text-xs text-fd-muted-foreground">Illustrative workflow · deadline at 08:00</p>
        </div>
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          <div role="group" aria-label="Example workflow scenario" className="mb-7 inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-fd-border bg-fd-background p-1">
            {(Object.keys(scenarios) as (keyof typeof scenarios)[]).map(key => <button key={key} type="button" aria-pressed={selected === key} aria-controls={panelId} onClick={() => setSelected(key)} className={`min-h-10 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${selected === key ? 'bg-teal-700 text-white dark:bg-teal-400 dark:text-neutral-950' : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground'}`}>{scenarios[key].label}</button>)}
          </div>
          <div id={panelId}>
            <ol className="grid gap-3 md:grid-cols-3 md:gap-7">
              {steps.map(({ name, functionName, icon: Icon }, index) => {
                const failed = index === 2 && scenario.alert;
                return <li key={name} className="relative">
                  <div className={`rounded-xl border bg-fd-background p-5 ${failed ? 'border-rose-600/40' : 'border-fd-border'}`}>
                    <div className="mb-5 flex items-center justify-between gap-2"><Icon className="size-5 text-fd-muted-foreground" aria-hidden /><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${failed ? 'text-rose-700 dark:text-rose-300' : 'text-teal-700 dark:text-teal-300'}`}>{failed ? <CircleAlert className="size-3.5" aria-hidden /> : <Check className="size-3.5" aria-hidden />}{failed ? 'Failed' : 'Done'}</span></div>
                    <h3 className="font-semibold">{name}</h3><p className="mt-1.5 break-all font-mono text-xs text-fd-muted-foreground">{functionName}</p>
                  </div>
                  {index < steps.length - 1 && <><ArrowRight className="absolute -right-5 top-1/2 hidden size-3.5 -translate-y-1/2 text-fd-muted-foreground md:block" aria-hidden /><ArrowDown className="mx-auto mt-3 size-4 text-fd-muted-foreground md:hidden" aria-hidden /></>}
                </li>;
              })}
            </ol>
            <div className="mt-6 grid gap-5 border-t border-fd-border pt-6 sm:grid-cols-[1fr_auto]" aria-live="polite" aria-atomic="true">
              <div className="flex items-start gap-3">
                {scenario.alert ? <CircleAlert className="mt-0.5 size-5 shrink-0 text-rose-700 dark:text-rose-300" aria-hidden /> : <Check className="mt-0.5 size-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden />}
                <div><p className="text-sm font-semibold">{scenario.title}<span className="ml-2 font-mono text-xs font-normal text-fd-muted-foreground">{scenario.time}</span></p><p className="mt-1.5 max-w-2xl text-sm leading-6 text-fd-muted-foreground">{scenario.text}</p></div>
              </div>
              <p className="self-start rounded-md bg-fd-secondary px-3 py-2 text-xs text-fd-muted-foreground">Monitor: <code>Invoices.Send</code></p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-fd-muted-foreground">A parent finishing is one step. The chain view shows the rest.</p>
        <Link href="/docs/5.x/guides/recurring-chains" className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:underline dark:text-teal-400">Build your first workflow <ArrowRight className="size-4" aria-hidden /></Link>
      </div>
    </section>
  );
}
