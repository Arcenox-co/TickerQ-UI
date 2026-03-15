# Redis Configuration

Configure Redis as a **job persistence provider** and multi-node coordination layer. Redis serves as a complete alternative to EF Core for storing all job data (time tickers, cron tickers, and cron occurrences).

## AddStackExchangeRedis

Registers Redis as the persistence provider for all job data and enables multi-node coordination.

**Method:**
```csharp
TickerOptionsBuilder<TTimeTicker, TCronTicker> AddStackExchangeRedis(
    Action<TickerQRedisOptionBuilder> setupAction);
```

**Example:**
```csharp
options.AddStackExchangeRedis(redisOptions =>
{
    redisOptions.Configuration = "localhost:6379";
    redisOptions.InstanceName = "tickerq:";
    redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(1);
});
```

::: tip
This single call replaces the need for `AddEntityFrameworkCore`. All job data is stored in Redis hashes and sorted sets. Both providers implement `ITickerPersistenceProvider` — you can swap between them by changing one line.
:::

## TickerQRedisOptionBuilder Options

### Configuration

Redis connection string.

**Type:** `string`

```csharp
redisOptions.Configuration = "localhost:6379";
// Or with password
redisOptions.Configuration = "localhost:6379,password=secret";
```

### InstanceName

Key prefix for all Redis keys.

**Type:** `string`
**Default:** `"tickerq:"`

```csharp
redisOptions.InstanceName = "myapp:tickerq:";
```

### NodeHeartbeatInterval

How often nodes send heartbeat signals.

**Type:** `TimeSpan`
**Default:** `TimeSpan.FromMinutes(1)`

```csharp
redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(1);
```

**Notes:**
- Heartbeat TTL = Interval + 20 seconds
- Lower intervals = faster dead node detection but more Redis load

## What Gets Registered

Calling `AddStackExchangeRedis` registers the following services:

| Service | Description |
|---------|-------------|
| `ITickerPersistenceProvider` | Redis-backed job storage (replaces EF Core) |
| `IConnectionMultiplexer` | Shared Redis connection |
| `IDatabase` | Redis database instance |
| `ITickerQRedisContext` | Redis context for node management |
| `NodeHeartBeatBackgroundService` | Automatic heartbeat + node registry |
| `IDistributedCache` (keyed) | Redis distributed cache |

## Multi-Node Setup

For multi-node deployments, each node should have a unique `NodeIdentifier`:

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "web-server-01"; // Unique per node
});

options.AddStackExchangeRedis(redisOptions =>
{
    redisOptions.Configuration = "redis-cluster:6379";
});
```

## See Also

- [Redis Integration](../../features/redis) - Complete Redis guide with storage details
- [Core Configuration](./core-configuration) - Scheduler options
- [Configuration Overview](./index) - All configuration sections
