"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, GitBranch, LayoutDashboard, Maximize2, Pause, Play, Plug, X } from "lucide-react";

const views = [
  {
    id: "overview", image: "overview", label: "Overview", shortLabel: "Overview", icon: LayoutDashboard,
    alt: "TickerQ demo overview with scheduler controls, execution charts, and recent jobs",
    caption: "See what is running, what is next, and what needs attention.",
    panX: 150,
  },
  {
    id: "chain", image: "chain", label: "Job chains", shortLabel: "Chains", icon: GitBranch,
    alt: "A real TickerQ demo job chain with connected steps and their execution status",
    caption: "Follow each step of a workflow, from the first job to the last.",
    panX: 400,
  },
  {
    id: "integrations", image: "integrations", label: "Connections", shortLabel: "Connect", icon: Plug,
    alt: "TickerQ Connections view with a saved Slack integration and delivery status",
    caption: "Manage connections for Slack, Teams, and custom webhooks in one place.",
    panX: 150,
  },
  {
    id: "assistant", image: "assistant-conversation", label: "AI assistant", shortLabel: "AI", icon: Bot,
    alt: "TickerQ AI conversation with a proposed time ticker and Confirm and Dismiss actions",
    caption: "Turn a request into a proposed job, then review the action before confirming it.",
    panX: 235,
  },
];

const rotationInterval = 6000;

function subscribeToReducedMotion(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeToPageVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function isPageVisible() {
  return document.visibilityState === "visible";
}

export function DashboardPreview() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playback, setPlayback] = useState<"automatic" | "playing" | "paused">("automatic");
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, prefersReducedMotion, () => true);
  const pageVisible = useSyncExternalStore(subscribeToPageVisibility, isPageVisible, () => false);
  const carousel = useRef<HTMLDivElement>(null);
  const tablist = useRef<HTMLDivElement>(null);
  const rotationControl = useRef<HTMLButtonElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const imageViewport = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const view = views[active];
  const rotationEnabled = playback === "playing" || (playback === "automatic" && !reducedMotion);
  const canRotate = rotationEnabled && !hovered && !expanded && inView && pageVisible;

  useEffect(() => {
    const element = carousel.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      { threshold: [0, 0.15] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canRotate) return;
    const timeout = window.setTimeout(() => setActive(index => (index + 1) % views.length), rotationInterval);
    return () => window.clearTimeout(timeout);
  }, [active, canRotate]);

  useEffect(() => {
    // Reveal the selected tab within its own scroller without moving the page.
    const list = tablist.current;
    const button = buttons.current[active];
    if (!list || !button) return;
    const item = button.getBoundingClientRect();
    const viewport = list.getBoundingClientRect();
    if (item.left < viewport.left) list.scrollLeft -= viewport.left - item.left;
    else if (item.right > viewport.right) list.scrollLeft += item.right - viewport.right;
  }, [active]);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (imageViewport.current) {
      imageViewport.current.scrollTop = 0;
      imageViewport.current.scrollLeft = view.panX;
    }
    return () => { document.body.style.overflow = previous; };
  }, [expanded, view.panX]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % views.length;
    else if (event.key === "ArrowLeft") next = (index + views.length - 1) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    else return;
    event.preventDefault();
    setPlayback("paused");
    setActive(next);
    buttons.current[next]?.focus();
  }

  function openPreview(event: MouseEvent<HTMLButtonElement>) {
    setPlayback("paused");
    returnFocus.current = event.currentTarget;
    dialog.current?.showModal();
    setExpanded(true);
  }

  function onClose() {
    setExpanded(false);
    returnFocus.current?.focus({ preventScroll: true });
  }

  return (
    <div
      id="dashboard-preview"
      ref={carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="TickerQ dashboard preview"
      className="flex min-w-0 flex-col scroll-mt-24"
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={event => {
        // Keyboard focus stops rotation; an explicit Play click can resume without moving focus.
        // Pointer focus on this control must not reverse the button's intended click action.
        const target = event.target as HTMLElement;
        if (target !== rotationControl.current || target.matches(":focus-visible")) {
          setPlayback("paused");
        }
      }}
    >
      <div className="order-2 mt-3 flex items-center gap-2">
        <button
          ref={rotationControl}
          type="button"
          aria-label={rotationEnabled ? "Pause carousel" : "Play carousel"}
          title={rotationEnabled ? "Pause carousel" : "Play carousel"}
          onClick={() => {
            setPlayback(rotationEnabled ? "paused" : "playing");
            if (!rotationEnabled) setHovered(false);
          }}
          className="order-last inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-fd-border text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300"
        >
          {rotationEnabled ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
        </button>
        <div ref={tablist} role="tablist" aria-label="Explore the dashboard" className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {views.map(({ id, label, shortLabel, icon: Icon }, index) => (
            <button key={id} id={`preview-tab-${id}`} ref={el => { buttons.current[index] = el; }} type="button" role="tab" aria-label={label} aria-selected={active === index} aria-controls={`preview-panel-${id}`} tabIndex={active === index ? 0 : -1} onClick={() => { setPlayback("paused"); setActive(index); }} onKeyDown={event => onKeyDown(event, index)} className={`inline-flex min-h-11 flex-1 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300 ${active === index ? "border-teal-600 text-teal-800 dark:border-teal-400 dark:text-teal-300" : "border-transparent text-fd-muted-foreground hover:border-fd-border hover:text-fd-foreground"}`}>
              <Icon className="hidden size-3.5 shrink-0 sm:block" aria-hidden />
              <span className="sm:hidden">{shortLabel}</span><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="order-1 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#101725] p-1.5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.3)] dark:border-slate-700/80 dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
        {views.map(({ id, image, label, alt }, index) => (
          <div key={id} id={`preview-panel-${id}`} role="tabpanel" aria-labelledby={`preview-tab-${id}`} hidden={active !== index}>
            {active === index && (
              <button type="button" onClick={openPreview} aria-haspopup="dialog" aria-label={`Expand ${label} screenshot`} className="group relative block aspect-[1440/920] w-full cursor-zoom-in overflow-hidden rounded-lg bg-[#080c16] text-start motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-teal-300">
                <Image src={`/images/dashboard/${image}.jpg`} alt={alt} width={1440} height={920} sizes="(min-width: 1280px) 660px, (min-width: 1024px) 55vw, (min-width: 640px) 576px, 100vw" className="block h-auto w-full" unoptimized preload={index === 0} />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#101725]/95 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm transition-colors group-hover:bg-[#182337] group-hover:text-white">
                  <Maximize2 className="size-3" aria-hidden />Expand view
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="order-3 mt-3 flex min-h-12 flex-wrap items-start justify-between gap-x-4 gap-y-2 text-xs leading-5">
        <p aria-live={rotationEnabled ? "off" : "polite"} className="max-w-[26rem] flex-1 basis-64 text-fd-muted-foreground">{view.caption}</p>
        <Link href="/docs/5.x/dashboard/tour" className="inline-flex shrink-0 items-center gap-1 font-medium text-teal-700 hover:underline dark:text-teal-400">Dashboard tour <ArrowRight className="size-3.5" aria-hidden /></Link>
      </div>
      <dialog ref={dialog} aria-labelledby="dashboard-preview-title" aria-describedby="dashboard-preview-description" onClose={onClose} className="fixed m-auto max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[1440px] overflow-hidden rounded-xl border border-white/15 bg-[#080c16] p-0 text-slate-100 shadow-2xl backdrop:bg-black/80">
        <div className="flex max-h-[calc(100dvh-26px)] flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-[#101725] px-4 py-3 sm:px-5">
            <div>
              <h2 id="dashboard-preview-title" className="text-sm font-semibold">{view.label} · TickerQ dashboard</h2>
              <p id="dashboard-preview-description" className="mt-1 text-xs text-slate-400">Screenshot from the 5.x demo. Scroll to explore the full view.</p>
            </div>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close dashboard preview" className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-teal-300">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div ref={imageViewport} role="region" aria-label="Full dashboard screenshot" tabIndex={0} className="min-h-0 overflow-auto overscroll-contain focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">
            {expanded && <Image src={`/images/dashboard/${view.image}.jpg`} alt={view.alt} width={1440} height={920} sizes="1440px" className="h-auto w-full min-w-[1040px] max-w-none" unoptimized />}
          </div>
        </div>
      </dialog>
    </div>
  );
}
