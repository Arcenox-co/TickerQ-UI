# 🔍 TickerQ vs Hangfire vs Quartz.NET

This page compares **TickerQ**, **Hangfire**, and **Quartz.NET** based on functionality, extensibility, performance, and developer experience. While all three are widely used, **TickerQ** provides the most modern, performant, and developer-friendly background task scheduling experience for .NET applications.

---

## ⚙️ Feature Comparison

| Feature                              | TickerQ                           | Hangfire                          | Quartz.NET                         |
|--------------------------------------|-----------------------------------|-----------------------------------|-------------------------------------|
| Cron scheduling                      | ✅ Yes                            | ✅ Yes                            | ✅ Yes                              |
| Time-based one-time jobs             | ✅ Yes (TimeTicker)               | ⚠️ Simulated via delay            | ✅ Yes                              |
| Persistent job store                 | ✅ With EF Core                   | ✅ Yes                            | ✅ Yes                              |
| In-memory mode                       | ✅ Built-in                       | ✅ Built-in                       | ✅ Built-in                         |
| Retry/cooldown logic                 | ✅ Advanced & configurable        | ⚠️ Basic retries only            | ⚠️ Manual                           |
| Dashboard UI                         | ✅ First-party + real-time        | ✅ Basic                          | ⚠️ Third-party required             |
| DI support                           | ✅ Native and seamless            | 🟠 Partial – type-based only      | ⚠️ Requires extra config            |
| Reflection-free job discovery        | ✅ Roslyn-based, compile-time     | ❌ Uses reflection                | ❌ Uses reflection                  |
| Multi-node/distributed support       | ✅ Native with EF Core            | ⚠️ Depends on storage             | ✅ Yes                              |
| Custom tickers (plugin model)        | ✅ Fully extensible               | ❌ Not extensible                 | ⚠️ Limited                          |
| Parallelism & concurrency control    | ✅ Built-in scheduler threadpool  | ✅ Queues/ServerCount             | ✅ ThreadPools                      |
| Performance under high load          | ✅ Optimized, no overhead         | ⚠️ Depends on storage/db         | ⚠️ Thread blocking possible         |
| Async/await support                  | ✅ Yes                            | ⚠️ Limited – wrapped sync methods| ✅ Yes                              |
| CancellationToken support            | ✅ Propagated & honored           | ❌ Not natively supported         | 🟠 Optional – must check manually   |

---

## 🧪 Developer Experience

| Area                  | TickerQ                          | Hangfire                         | Quartz.NET                        |
|-----------------------|----------------------------------|----------------------------------|----------------------------------|
| Setup time            | 🟢 Minimal, zero config needed    | 🟠 Easy but reflection-based     | 🔴 Verbose and complex             |
| API design            | 🟢 Modern attribute-first         | 🟠 Static/Manual                  | 🔴 Old interface-based             |
| Configuration style   | 🟢 Clean C# attributes            | 🟠 Requires registration          | 🔴 XML or complex builders         |
| Extensibility         | 🟢 Open, plugin-based             | 🔴 Closed architecture            | 🟠 Requires extension libraries    |
| Debuggability         | 🟢 Compile-time verified          | 🔴 Errors at runtime              | 🟠 Harder to trace                 |

---

## 🚀 Why Choose TickerQ?

TickerQ is purpose-built for modern .NET developers who want:

- ✅ **Compile-time safety** with Roslyn analyzers and source generators
- ✅ **Zero reflection**, fully optimized for performance
- ✅ **Native DI support**, no need for job activators
- ✅ **Flexible extensibility** with a plugin-style ticker model
- ✅ **Built-in scheduler and threadpool** for reliable and deterministic execution
- ✅ **High performance**, minimal memory footprint, and no background polling
- ✅ **Works in-memory or with EF Core**, offering smooth scalability
- ✅ **Real-time dashboard**, designed with SignalR and Tailwind CSS

TickerQ keeps your background processing simple, fast, and under your control — while enabling enterprise-grade reliability when you need it.

---