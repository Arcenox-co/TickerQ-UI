# TickerQ in plain language

**TickerQ** is a background job scheduler for .NET. You register *jobs* (functions that run on a schedule or at a specific time), and TickerQ runs them on worker threads, tracks their status, and can persist them to a database or Redis so work survives restarts and can be shared across servers.

## What makes it different

Most .NET schedulers find your job code at **runtime** using reflection. TickerQ uses a **C# source generator** at **compile time** instead. That means:

- Wrong job names or wiring often show up as **compile errors**, not mysterious failures at runtime.
- The library fits **Native AOT** scenarios where heavy reflection is a problem.
- Startup avoids scanning assemblies for handlers.

## The two kinds of schedules

| Kind | What it does | Typical use |
|------|----------------|-------------|
| **Time ticker** | Runs **once** at a chosen UTC time | “Send this email in 5 minutes,” “process this order later” |
| **Cron ticker** | Runs **repeatedly** on a cron expression | Nightly reports, periodic syncs, cleanup |

Only **time tickers** support **chaining**: a parent job can automatically enqueue child jobs when it succeeds, fails, is cancelled, and so on.

## How you write a job

1. **Attribute** — Mark a method with `[TickerFunction("unique-name")]` (and optionally a `cronExpression` for recurring jobs).
2. **Interface** — Implement `ITickerFunction` / `ITickerFunction<TPayload>` and register with `MapTicker<...>()` (strongly typed, no magic strings when scheduling by type).
3. **Lambda** — For small jobs, register an inline delegate with `MapTicker(...)`.

Handlers receive a **`TickerFunctionContext`** (and optionally a typed **`Request`**). Dependencies are injected into your classes like any other service.

## Where jobs are stored

By default, jobs live **in memory** (fine for development). For production you plug in:

- **SQL** via **Entity Framework Core** (`TickerQ.EntityFrameworkCore`)
- **Redis** for speed and multi-node coordination (`TickerQ.Caching.StackExchangeRedis`)

The same APIs apply; you change configuration, not your job code.

## Other useful pieces (optional packages)

- **Dashboard** — Web UI (Vue + SignalR) to watch jobs, edit schedules, and inspect history.
- **OpenTelemetry** — Traces and structured logs around job execution.

## Mental model in one sentence

You **define** what can run (named functions), **schedule** when it runs (one-off time or cron), and TickerQ **executes**, **retries**, **persists**, and optionally **chains** work—without relying on reflection to discover your handlers.

For step-by-step setup and API details, see the docs site built from `content/docs` (e.g. [Quick Start](content/docs/getting-started/quick-start.mdx)).
