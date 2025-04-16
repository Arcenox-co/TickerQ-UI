# Choosing Your TickerQ Setup

TickerQ provides two primary modes: **In-Memory** and **EF Core**. Use the comparison below to decide which mode fits your application's needs.

---

## 🧩 Feature Comparison

| Feature                         | In-Memory Mode (`TickerQ`) | EF Core Mode (`TickerQ.EntityFramework`) |
|--------------------------------|-----------------------------|------------------------------------------|
| Cron-based scheduling          | ✅                          | ✅                                       |
| Time-based scheduling (`TimeTicker`) | ❌                     | ✅                                       |
| Job persistence                | ❌                          | ✅                                       |
| Retry/cooldown tracking        | ❌                          | ✅                                       |
| Multi-node support             | ❌                          | ✅                                       |
| Dependency Injection (DI)      | ✅                          | ✅                                       |
| Reflection-free execution      | ✅                          | ✅                                       |
| Source generator (Roslyn)      | ✅                          | ✅                                       |
| Dashboard compatibility        | ❌                          | ✅ (requires additional package)         |


## ✅ When to Use What

| Scenario                          | Recommended Setup     |
|----------------------------------|------------------------|
| Local tools, simple cron jobs     | In-Memory Mode         |
| Persistent recurring jobs         | EF Core Mode           |
| Time-delayed or scheduled jobs    | EF Core Mode           |
| Production-grade reliability      | EF Core Mode           |
| Distributed execution environments| EF Core Mode           |


## 📦 What to Install

| Setup Type       | Required Packages                                                | Docs                                      |
|------------------|------------------------------------------------------------------|-------------------------------------------|
| In-Memory        | `TickerQ`                                                        | [Install](/intro/tickerq-core)            |
| EF Core          | `TickerQ` + `TickerQ.EntityFramework`                            | [Install](/intro/tickerq-ef-core)         |

