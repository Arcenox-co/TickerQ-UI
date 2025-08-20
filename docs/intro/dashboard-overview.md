# Dashboard Features

The **TickerQ Dashboard** is a real-time, browser-based interface that allows you to visualize, manage, and interact with all your jobs. It's built using SignalR to provide seamless live updates on job statuses, executions, and activity across your distributed environment.

---

## Dashboard Overview

The main Dashboard displays:

- Total job counts and statuses across all tickers
- Concurrency and thread usage stats
- Declared functions and machines involved
- Status breakdown (Done, Failed, Cancelled, etc.)
- Alerts and system-wide activity summary

    <div class="w-full">
      <img src="/Screenshot_Dashboard.jpeg" alt="System Overview & Machines"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>

## Time Tickers View

The **Time Tickers** panel allows you to:

- View all scheduled time-based jobs
- See retry intervals, job status, and execution history
- Use visual tools like pie charts and execution timelines

 <div class="w-full">
      <img src="/Screenshot_TimeTicker_View.jpeg" alt="TimeTicker Execution Table"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>

## Cron Tickers View

The **Cron Tickers** panel includes:

- Jobs scheduled with cron expressions
- Graphs showing execution timelines and statuses
- Edit, delete, or manually trigger tickers


 <div class="w-full">
      <img src="/Screenshot_CronTicker_View.jpeg" alt="CronTicker Chart & Table"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>

## Creating Jobs

You can **create new TimeTicker or CronTicker jobs** with:

- A dropdown to select a method/function
- Short descriptions and retry configuration
- JSON request payload input
- Optional immediate execution toggle

 <div class="w-full">
      <img src="/Screenshot_Add_New_Time_Ticker.jpeg" alt="New Job Creation"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>


## Editing Jobs

Editing an existing job allows you to:

- Update the description, intervals, and retry logic
- Change cron expressions or function targets
- Resubmit with new request data

<div class="w-full">
      <img src="/Screenshot_Update_Cron_Ticker.jpeg" alt="Job Editing"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>


## Viewing Occurrences

You can inspect individual occurrences (instances of executions) of any CronTicker:

- See lock holder, execution time, and elapsed time
- Cancel or delete specific occurrences if needed

<div class="w-full">
      <img src="/Screenshot_Show_Occurrecies.jpeg" alt="Cron Job Occurrences"
           onclick="window.showModal(this.src)"
           class="cursor-zoom-in w-full rounded-lg shadow border border-gray-300 dark:border-gray-700 transition-transform hover:scale-105">
    </div>


## Job Actions

The TickerQ Dashboard supports different actions based on the job type and status. Here's a complete reference of available actions across both **Time Tickers** and **Cron Tickers**:

| Icon                                                                                             | Action          | Applies To  | Visible When                                              | Description                                                                             |
| ------------------------------------------------------------------------------------------------ | --------------- | ----------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/cancel.svg" width="20" />                    | **Cancel**      | Time Ticker | Only when job is `InProgress`                             | Gracefully cancels the running job using `CancellationToken`.                           |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/pencil.svg" width="20" />                    | **Edit**        | Both        | Time: `Idle` or `Queued`<br>Cron: Always visible          | Opens the job for editing. TimeTicker uses `executionTime`, Cron uses `cronExpression`. |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/plus-box-multiple-outline.svg" width="20" /> | **Duplicate**   | Time Ticker | When not `Idle` or `Queued`                               | Opens the job in duplicate mode. Used for rescheduling quickly.                         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/delete.svg" width="20" />                    | **Delete**      | Both        | Disabled when job is `InProgress` (Time), always for Cron | Deletes the job (or prompts if system-seeded).                                          |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/chart-areaspline.svg" width="20" />          | **Graph**       | Cron Ticker | Always visible                                            | Shows historical execution chart for the ticker.                                        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/folder-open.svg" width="20" />               | **Occurrences** | Cron Ticker | Always visible                                            | Opens a list of all Cron executions and their statuses.                                 |

## Features Summary

- ✅ Real-time updates via **SignalR**
- ✅ **Add, edit, delete, or duplicate** both Cron and TimeTicker jobs
- ✅ **Cancel** currently running TimeTicker jobs via `CancellationToken`
- ✅ View **job timelines**, **retry intervals**, and **execution history**
- ✅ Visual **status breakdowns** (Success, Failed, Cancelled, etc.)
- ✅ **Execution graphs** for Cron Tickers with animation on each retry step.
- ✅ View and inspect **individual Cron occurrences**
- ✅ **Secure access** via Basic Auth


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