---
layout: home

hero:
  name: "TickerQ"
  text: ""
  tagline: "TickerQ is a fast, reflection-free background task scheduler for .NET — built with source generators, EF Core integration, cron + time-based execution, and a real-time dashboard."
  image:
    src: /tickerq-logo.png
    style:
      max-width: 350px
  actions:
    - theme: brand
      text: Get Started
      link: /intro/what-is-tickerq
    - theme: alt
      text: View on GitHub
      link: https://github.com/Arcenox-co/TickerQ

features:
  - title: Minimal Core, Maximum Performance
    details: The core `TickerQ` library is lightweight, reflection-free, and dependency-free—designed to run inside your .NET application with ultra-low overhead and deterministic execution.
  - title: EF Core Integration with TickerQ.EntityFramework
    details: Add `TickerQ.EntityFramework` to persist tickers, job states, and execution history in your own database. Built to plug directly into your existing `DbContext` with full support for queries, retries, and cleanup.
  - title: Visual Control with TickerQ.Dashboard
    details: Bring visibility to your background processing. The `TickerQ.Dashboard` package provides a ready-to-use, real-time web UI to inspect, manage, and trigger jobs—powered by SignalR and styled with Tailwind.
  - title: Advanced Scheduling Engine
    details: Whether it’s second-precise `TimeTickers` or flexible `CronTickers`, TickerQ supports both with built-in throttling, cooldown control, and priority-based job queuing.
---

## Dashboard Overview

<div class="rounded-lg">

  <!-- 1. Real-Time Status Summary & Machines -->
  <div class="flex flex-col lg:flex-row items-center gap-10">
    <div class="w-full lg:w-1/2">
      <h3 class="text-xl font-semibold mb-4">System Status & Function Distribution</h3>
      <p class="text-lg leading-relaxed">
        This panel gives you a high-level snapshot of your TickerQ instance. It displays active status, job throughput from the past 7 days, current machine identity, max concurrency, and scheduled tick times. 
        The right panel breaks down job states (e.g., Done, DueDone, Failed) using both raw counts and percentage bars.
        Below, it lists <strong>Declared Functions</strong> and <strong>Used Machines</strong>, showing how jobs are distributed across nodes and what functions are registered for execution.
      </p>
    </div>
    <div class="w-full lg:w-1/2">
      <img src="/Screenshot_14-4-2025_155111_localhost.jpeg" alt="System Overview & Machines"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>
  </div>

  <!-- 2. CronTicker Activity and Visualization -->
  <div class="flex flex-col lg:flex-row-reverse items-center gap-10">
    <div class="w-full lg:w-1/2">
      <h3 class="text-xl font-semibold mb-4">CronTickers Overview</h3>
      <p class="text-lg leading-relaxed">
        The CronTicker tab presents recurring task executions in detail. At the top, a pie chart and line graph visualize recent job states by date and type. You can observe how many jobs succeeded (Done), were deferred (DueDone), or failed.
        Below the chart, a structured table shows the list of cron tickers, including the function name, cron expression, retry intervals, initialization ID, and timestamps. Quick actions allow real-time inspection, editing, or deletion of any entry.
      </p>
    </div>
    <div class="w-full lg:w-1/2">
      <img src="/Screenshot_14-4-2025_15552_localhost.jpeg" alt="CronTicker Chart & Table"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>
  </div>

  <!-- 3. TimeTicker Execution & Status Tracking -->
  <div class="flex flex-col lg:flex-row items-center gap-10">
    <div class="w-full lg:w-1/2">
      <h3 class="text-xl font-semibold mb-4">TimeTickers Execution History</h3>
      <p class="text-lg leading-relaxed">
        This section is dedicated to <strong>TimeTicker</strong> execution tracking. Visualizations include daily status lines that distinguish between Done, Failed, Idle, DueDone, and other states.
        The data grid beneath provides a log of all executions, including retry intervals, request types, lock holders (machine names), execution times, and runtime durations.
        Each row is color-coded based on outcome (e.g., green for success, red for failure), and includes tools to quickly re-run or edit failed jobs.
      </p>
    </div>
    <div class="w-full lg:w-1/2">
      <img src="/Screenshot_14-4-2025_155448_localhost.jpeg" alt="TimeTicker Execution Table"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>
  </div>

</div>

<!-- Modal Lightbox -->
<div id="imgModal" class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center hidden">
  <span onclick="window.closeModal()" class="absolute top-4 right-6 text-white text-3xl cursor-pointer">&times;</span>
  <img id="modalImage" src="" alt="Full preview"
       class="max-w-[90%] max-h-[85%] rounded-lg shadow-xl border-4 border-white">
</div>

<script>
if (typeof window !== 'undefined') {
window.showModal = function (src) {
    const modal = document.getElementById("imgModal");
    const image = document.getElementById("modalImage");
    image.src = src;
    modal.classList.remove("hidden");
  };

  window.closeModal = function () {
    const modal = document.getElementById("imgModal");
    modal.classList.add("hidden");
  };
}
</script>
