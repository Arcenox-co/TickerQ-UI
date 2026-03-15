# Scheduler Configuration

Configure scheduler behavior including worker threads, timeouts, node identification, and timezone settings.

## ConfigureScheduler

Configure scheduler-specific options.

**Method:**
```csharp
TickerOptionsBuilder<TTimeTicker, TCronTicker> ConfigureScheduler(
    Action<SchedulerOptionsBuilder> schedulerOptionsBuilder);
```

**Example:**
```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.MaxConcurrency = 10;
    scheduler.NodeIdentifier = "production-server-01";
    scheduler.IdleWorkerTimeOut = TimeSpan.FromMinutes(2);
    scheduler.FallbackIntervalChecker = TimeSpan.FromSeconds(30);
    scheduler.SchedulerTimeZone = TimeZoneInfo.Utc;
});
```

## SchedulerOptionsBuilder Properties

### MaxConcurrency

Maximum number of concurrent worker threads.

**Type:** `int`  
**Default:** `Environment.ProcessorCount`  
**Range:** 1 to 64

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.MaxConcurrency = 10;
});
```

**Recommendations:**
- **I/O-bound jobs**: 2x CPU cores (for jobs that wait on network, database, file I/O)
- **CPU-bound jobs**: 1x CPU cores (for computational workloads)
- **Mixed workloads**: Start with CPU cores, adjust based on monitoring
- Higher values increase throughput but use more memory and CPU resources

**Performance Considerations:**
- Too low: Jobs may queue up, slower execution
- Too high: Context switching overhead, memory pressure
- Monitor job execution times and adjust accordingly

### NodeIdentifier

Unique identifier for this node in multi-node deployments.

**Type:** `string`  
**Default:** `Environment.MachineName`

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "web-server-01";
});
```

**When to Set:**
- Multi-node deployments (multiple instances running)
- Containerized environments (Docker, Kubernetes)
- Load-balanced scenarios
- When `Environment.MachineName` isn't unique or meaningful

**Best Practices:**
- Use environment-specific identifiers (e.g., `production-web-01`)
- Include deployment information (e.g., `{env}-{service}-{instance}`)
- Make it descriptive for debugging and monitoring

**Example:**
```csharp
scheduler.NodeIdentifier = $"{Environment.GetEnvironmentVariable("ENVIRONMENT")}-web-{Environment.GetEnvironmentVariable("INSTANCE_ID")}";
```

### IdleWorkerTimeOut

Time before idle workers are shut down.

**Type:** `TimeSpan`  
**Default:** `TimeSpan.FromMinutes(1)`  
**Range:** 1 second to 24 hours

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.IdleWorkerTimeOut = TimeSpan.FromMinutes(2);
});
```

**How It Works:**
- Workers that haven't processed jobs for this duration are terminated
- New workers are created automatically when jobs are queued
- Helps conserve resources during low-load periods

**Recommendations:**
- **High-frequency jobs**: Lower timeout (30 seconds - 1 minute)
- **Low-frequency jobs**: Higher timeout (2-5 minutes)
- Balance between resource usage and response time

### FallbackIntervalChecker

Interval for fallback job checking when scheduler is idle.

**Type:** `TimeSpan`  
**Default:** `TimeSpan.FromSeconds(30)`

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.FallbackIntervalChecker = TimeSpan.FromSeconds(60);
});
```

**Purpose:**
- Ensures jobs are checked even when no workers are active
- Prevents missing jobs due to timing issues
- Acts as a safety mechanism for job discovery

**When to Adjust:**
- Increase if you have very infrequent jobs (5-15 minutes)
- Decrease if you need faster job detection (10-30 seconds)
- Default is usually sufficient for most scenarios

### MinPollingInterval

Minimum interval between database polls. Prevents tight loops when tasks are due or when the database is empty.

**Type:** `TimeSpan`
**Default:** `TimeSpan.FromSeconds(1)`

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.MinPollingInterval = TimeSpan.FromSeconds(2);
});
```

**When to Adjust:**
- Increase if database load is a concern and you don't need sub-second scheduling precision
- Decrease only if you need tighter scheduling accuracy (not recommended below 500ms)

### SchedulerTimeZone

Timezone for scheduling calculations.

**Type:** `TimeZoneInfo`  
**Default:** `TimeZoneInfo.Local`

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.SchedulerTimeZone = TimeZoneInfo.Utc;
    // Or specific timezone
    scheduler.SchedulerTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
});
```

**Recommendation:** Use UTC for consistency across servers.

**Why UTC?**
- Consistent behavior across different server locations
- No daylight saving time issues
- Easier debugging and log analysis
- Standard practice for distributed systems

**When to Use Local Time:**
- Business requirements specify local time
- Jobs must run at specific local business hours
- User-facing scheduling interfaces use local time

**Example:**
```csharp
// UTC (recommended)
scheduler.SchedulerTimeZone = TimeZoneInfo.Utc;

// Specific timezone
scheduler.SchedulerTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");

// From configuration
var timezoneId = builder.Configuration["TickerQ:TimeZone"] ?? "UTC";
scheduler.SchedulerTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
```

## Complete Scheduler Configuration

```csharp
builder.Services.AddTickerQ(options =>
{
    options.ConfigureScheduler(scheduler =>
    {
        // Concurrency
        scheduler.MaxConcurrency = Environment.ProcessorCount * 2; // I/O-bound
        
        // Node identification
        scheduler.NodeIdentifier = $"{Environment.MachineName}-{Environment.GetEnvironmentVariable("DEPLOYMENT_ID")}";
        
        // Timeouts
        scheduler.IdleWorkerTimeOut = TimeSpan.FromMinutes(2);
        scheduler.FallbackIntervalChecker = TimeSpan.FromSeconds(30);
        
        // Timezone
        scheduler.SchedulerTimeZone = TimeZoneInfo.Utc;
    });
});
```

## Multi-Node Configuration

For multi-node deployments, ensure each node has a unique identifier:

```csharp
// Node 1
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "production-web-01";
});

// Node 2
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "production-web-02";
});

// Node 3
options.ConfigureScheduler(scheduler =>
{
    scheduler.NodeIdentifier = "production-web-03";
});
```

## Performance Tuning

### For High-Throughput Scenarios

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.MaxConcurrency = 20; // Increase workers
    scheduler.IdleWorkerTimeOut = TimeSpan.FromMinutes(5); // Keep workers longer
    scheduler.FallbackIntervalChecker = TimeSpan.FromSeconds(10); // Check more frequently
});
```

### For Low-Resource Scenarios

```csharp
options.ConfigureScheduler(scheduler =>
{
    scheduler.MaxConcurrency = 2; // Minimal workers
    scheduler.IdleWorkerTimeOut = TimeSpan.FromSeconds(30); // Shutdown quickly
    scheduler.FallbackIntervalChecker = TimeSpan.FromMinutes(1); // Check less frequently
});
```

## See Also

- [Exception Handling](./exception-handling) - Error handling configuration
- [Start Mode](./start-mode) - Application startup control
- [Core Configuration Overview](./index) - All core configuration options
- [Redis Configuration](../redis-configuration) - Multi-node coordination

