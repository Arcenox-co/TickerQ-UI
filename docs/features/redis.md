# Redis Integration

TickerQ.Caching.StackExchangeRedis provides **Redis as a full job persistence and storage provider** — a lightweight alternative to EF Core. All job data (time tickers, cron tickers, and cron occurrences) is stored directly in Redis using hashes, sets, and sorted sets. No relational database required.

It also provides multi-node distributed coordination with heartbeats and dead-node detection.

::: tip Redis as Job Storage
Redis isn't just for caching or coordination in TickerQ. It's a complete **storage backend** for all your jobs — implementing the same `ITickerPersistenceProvider` interface as EF Core. You can swap between them by changing one line of configuration.
:::

## Sections

### [Installation](./redis/installation)
Install the Redis package and configure Redis server connection.

### [Setup](./redis/setup)
Basic Redis configuration and integration with TickerQ.

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

## Configuration Options

### Connection String

```csharp
redisOptions.Configuration = "localhost:6379";
// Or with password
redisOptions.Configuration = "localhost:6379,password=your-password";
// Or full connection string
redisOptions.Configuration = "server=localhost:6379;password=secret;ssl=true";
```

### Instance Name

Prefix for all Redis keys:

```csharp
redisOptions.InstanceName = "tickerq:"; // Default
// Job keys will be: tq:tt:{id}, tq:cron:{id}, tq:co:{id}, etc.
```

### Node Heartbeat Interval

How often each node sends heartbeat signals:

```csharp
redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(1); // Default
```

## How Jobs Are Stored in Redis

| Data | Redis Structure | Key Pattern |
|------|----------------|-------------|
| Time Tickers | Hash per entity + ID set | `tq:tt:{id}`, `tq:tt:ids` |
| Cron Tickers | Hash per entity + ID set | `tq:cron:{id}`, `tq:cron:ids` |
| Cron Occurrences | Hash per entity + ID set | `tq:co:{id}`, `tq:co:ids` |
| Pending Time Tickers | Sorted set (by execution time) | `tq:tt:pending` |
| Pending Occurrences | Sorted set (by execution time) | `tq:co:pending` |

The provider uses optimistic concurrency on `UpdatedAt` and lock-holder semantics to prevent duplicate execution across nodes.

## Multi-Node Coordination

### Node Identification

Each node is identified by a unique name:

```csharp
builder.Services.AddTickerQ(options =>
{
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.NodeIdentifier = "production-server-01";
    });
    // Or use Environment.MachineName (default)
});
```

### Node Heartbeat

TickerQ automatically sends heartbeats to Redis to indicate node health:

- **Heartbeat Key**: `{instanceName}hb:{nodeIdentifier}`
- **TTL**: Heartbeat interval + 20 seconds
- **Format**: JSON with timestamp and node identifier

### Node Registry

All active nodes are registered in Redis:

- **Registry Key**: `{instanceName}nodes:registry`
- **Format**: JSON array of node identifiers
- **TTL**: 30 days sliding expiration

## Background Service

TickerQ automatically registers a background service (`NodeHeartBeatBackgroundService`) that:
- Sends periodic heartbeats
- Updates node registry
- Notifies dashboard of node status

This service runs automatically when Redis is configured.

## Use Cases

### 1. Lightweight Job Storage

Use Redis as your sole persistence layer — no database migrations, no DbContext:

```csharp
builder.Services.AddTickerQ(options =>
{
    options.AddStackExchangeRedis(redisOptions =>
    {
        redisOptions.Configuration = "localhost:6379";
    });
});
```

### 2. Multi-Node Deployment

Deploy TickerQ across multiple servers with Redis coordination:

```csharp
// Server 1
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "web-server-01";
});

// Server 2
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "web-server-02";
});

// Server 3
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "web-server-03";
});
```

All servers share the same Redis instance, and jobs are distributed based on locking mechanisms.

### 3. Health Monitoring

Monitor node health through Redis:

```csharp
public class HealthCheckService
{
    private readonly ITickerQRedisContext _redisContext;

    public async Task<NodeHealthStatus> GetNodeHealthAsync()
    {
        var deadNodes = await _redisContext.GetDeadNodesAsync();
        var allNodes = await GetAllRegisteredNodesAsync();

        return new NodeHealthStatus
        {
            TotalNodes = allNodes.Count,
            DeadNodes = deadNodes.Length,
            HealthyNodes = allNodes.Count - deadNodes.Length
        };
    }
}
```

## Redis vs EF Core

| Criteria | Redis | EF Core |
|----------|-------|---------|
| Setup complexity | Minimal — just a connection string | Requires DbContext, migrations |
| Storage | In-memory (with optional disk persistence) | Relational database on disk |
| Query flexibility | Key-based lookups | Full LINQ / SQL queries |
| Long-term history | Limited by Redis memory | Unlimited (disk-based) |
| Performance | Very fast reads/writes | Database-dependent |
| Multi-node coordination | Built-in heartbeats + locking | Requires separate Redis add-on |
| Best for | High-throughput, ephemeral jobs | Audit trails, complex queries |

## Best Practices

### 1. Unique Node Identifiers

Ensure each node has a unique identifier:

```csharp
// Good: Use machine-specific identifier
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = Environment.MachineName;
});

// Good: Use deployment-specific identifier
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = $"{Environment.MachineName}-{Environment.GetEnvironmentVariable("DEPLOYMENT_ID")}";
});

// Bad: Hardcoded value (will conflict in multi-node)
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "server";
});
```

### 2. Heartbeat Interval

Balance between freshness and Redis load:

```csharp
// Too frequent: High Redis load
redisOptions.NodeHeartbeatInterval = TimeSpan.FromSeconds(10);

// Good: Balance
redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(1);

// Too infrequent: Slower dead node detection
redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(5);
```

### 3. Redis High Availability

Use Redis Sentinel or Cluster for production:

```csharp
redisOptions.Configuration = "sentinel1:26379,sentinel2:26379,serviceName=mymaster";
```

### 4. Redis Persistence

If you need jobs to survive Redis restarts, enable Redis persistence (RDB or AOF) in your Redis server configuration.

## Troubleshooting

### Nodes Not Appearing in Registry

- Verify Redis connection string
- Check node identifier uniqueness
- Verify heartbeat interval is not too long
- Check Redis key expiration

### Dead Node Detection Not Working

- Verify heartbeat TTL calculation (interval + 20 seconds)
- Check Redis connectivity
- Verify background service is running
- Check application logs for errors

## Next Steps

- [Learn About Entity Framework](/features/entity-framework)
- [Explore Dashboard Features](/features/dashboard)
- [Set Up OpenTelemetry](/features/opentelemetry)
