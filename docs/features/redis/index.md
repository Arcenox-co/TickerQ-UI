# Redis Integration

TickerQ.Caching.StackExchangeRedis provides **Redis as a full job persistence and storage provider** — a lightweight alternative to EF Core. All job data (time tickers, cron tickers, and cron occurrences) is stored directly in Redis using hashes, sets, and sorted sets. No relational database required.

In addition to job storage, it provides multi-node distributed coordination with node heartbeat tracking and dead-node detection.

::: tip Redis vs EF Core
Redis is ideal when you want fast, in-memory job storage without a relational database. Use EF Core when you need queryable history, relational joins, or long-term persistence on disk. Both implement the same `ITickerPersistenceProvider` interface — you can swap between them by changing one line of configuration.
:::

## Sections

### [Installation](./installation)
Install the Redis package and configure Redis server connection.

### [Setup](./setup)
Basic Redis configuration and integration with TickerQ.

### [Distributed Coordination](./distributed-coordination)
Multi-node coordination, heartbeat monitoring, and dead-node cleanup.

### [Integration](./integration)
Integrate Redis with cloud services, containers, and infrastructure platforms.

## Quick Start

```csharp
using TickerQ.DependencyInjection;
using TickerQ.Caching.StackExchangeRedis.DependencyInjection;

builder.Services.AddTickerQ(options =>
{
    // Redis as your job storage + coordination provider
    options.AddStackExchangeRedis(redisOptions =>
    {
        redisOptions.Configuration = "localhost:6379";
        redisOptions.InstanceName = "tickerq:";
        redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(1);
    });
});
```

This single call registers Redis as the **persistence provider** for all job data and enables multi-node coordination. No EF Core or database setup needed.

## Key Features

- **Job Storage Provider**: Stores all time tickers, cron tickers, and cron occurrences directly in Redis — a complete alternative to EF Core
- **Optimistic Concurrency**: Uses `UpdatedAt`-based concurrency checks, mirroring EF Core behavior
- **Lock-Holder Semantics**: Each job execution is locked to a specific node to prevent duplicate runs
- **Sorted-Set Scheduling**: Pending jobs are indexed by execution time for efficient polling
- **Node Heartbeat**: Automatic node health monitoring with configurable intervals
- **Dead-Node Detection**: Identifies and cleans up unresponsive nodes
- **High Availability**: Supports Redis Cluster and Sentinel for production deployments

## How It Stores Jobs

| Data | Redis Structure | Key Pattern |
|------|----------------|-------------|
| Time Tickers | Hash per entity + ID set | `tq:tt:{id}`, `tq:tt:ids` |
| Cron Tickers | Hash per entity + ID set | `tq:cron:{id}`, `tq:cron:ids` |
| Cron Occurrences | Hash per entity + ID set | `tq:co:{id}`, `tq:co:ids` |
| Pending Time Tickers | Sorted set (by execution time) | `tq:tt:pending` |
| Pending Occurrences | Sorted set (by execution time) | `tq:co:pending` |

## When to Use Redis vs EF Core

| Criteria | Redis | EF Core |
|----------|-------|---------|
| Setup complexity | Minimal — just a connection string | Requires DbContext, migrations |
| Storage | In-memory (with optional persistence) | Relational database on disk |
| Query flexibility | Key-based lookups | Full LINQ / SQL queries |
| Long-term history | Limited by Redis memory | Unlimited (disk-based) |
| Performance | Very fast reads/writes | Database-dependent |
| Multi-node coordination | Built-in heartbeats + locking | Requires separate Redis add-on |
| Best for | High-throughput, ephemeral jobs | Audit trails, complex queries |

## Next Steps

- [Installation Guide](./installation) - Set up Redis integration
- [Configuration](./setup) - Configure Redis options
- [Distributed Features](./distributed-coordination) - Multi-node coordination
