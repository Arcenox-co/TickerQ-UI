# What is TickerQ?

In the expansive .NET ecosystem, **TickerQ** emerges as a modern, modular platform for managing background processing, task scheduling, and execution pipelines. Built for high performance and extensibility, it allows developers to schedule, throttle, and track background jobs with minimal overhead. When combined with its companion packages like `TickerQ.EntityFramework` and `TickerQ.Dashboard`, it offers a complete, observable infrastructure for background task orchestration in both single-node and distributed environments.

<div class="tip custom-block" style="padding-top:8px;">
    <p>Just want to try it out? 👉  
        <a href="/setup/tickerq-core.html">Quickstart</a>.
    </p>
</div>

---

### Main Package: `TickerQ`

`TickerQ` is the core scheduling engine—designed to execute recurring and deferred jobs without blocking your main application thread. It provides a lean and deterministic execution loop with no reliance on external services.

A built-in **Roslyn Source Generator** is included to analyze and generate boilerplate code at compile time. This enables **zero-reflection** registration and dispatching of your job functions, ensuring maximum runtime performance and full type safety. Misconfigurations are caught early during development, saving hours of debugging and avoiding runtime surprises.

Ideal for:
- Queuing fire-and-forget jobs
- Deterministic and minimal-overhead execution
- Compile-time job validation and codegen
- Composable job execution pipelines

---

### Extension Package: `TickerQ.EntityFramework`

`TickerQ.EntityFramework` adds job persistence, retry tracking, and time-based scheduling through seamless integration with your existing EF Core `DbContext`. It enables full historical tracking, database-based scheduling (`TimeTickers` and `CronTickers`), and is designed with scale-out scenarios in mind. Whether you're building a multi-node system or need database-backed reliability, this package ensures that no job is lost—even under load balancing or restarts.

Ideal for:
- Time- or cron-based recurring jobs
- Long-running workflows with retry logic
- Distributed task management across containers or services

---

### 📊 UI Companion: `TickerQ.Dashboard`

Built with Tailwind and powered by SignalR, `TickerQ.Dashboard` offers a live, interactive interface to inspect running jobs, monitor system health, and perform manual operations. Visual charts, lock tracking, retry history, and job filtering make it easy to manage your infrastructure in production.

Ideal for:
- Real-time observability
- Operator-friendly job control (retries, edit, delete)
- Debugging failed or stalled jobs at runtime

---

Whether you’re building a microservice, API, or job-intensive application, **TickerQ** equips you with the tools needed for resilient, maintainable, and performant background task execution.