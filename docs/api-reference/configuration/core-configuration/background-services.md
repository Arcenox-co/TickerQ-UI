# Background Services

Control whether TickerQ registers and runs background job processing services.

## DisableBackgroundServices

Disable registration of background services for queue-only mode.

**Method:**
```csharp
TickerOptionsBuilder<TTimeTicker, TCronTicker> DisableBackgroundServices();
```

**Example:**
```csharp
builder.Services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    // Only register managers for queuing jobs, no processing
    options.DisableBackgroundServices();
});
```

## Background Services

By default, TickerQ registers the following background services:

| Service | Purpose |
|---------|---------|
| `TickerQSchedulerBackgroundService` | Main scheduler for job execution |
| `TickerQFallbackBackgroundService` | Fallback job checking mechanism |
| `TickerQDispatcher` | Dispatches jobs to worker threads |
| `TickerQTaskScheduler` | Manages worker thread pool |

When `DisableBackgroundServices()` is called, these services are replaced with no-operation implementations that do not process jobs.

## Queue-Only Mode

When background services are disabled, TickerQ operates in "queue-only" mode:

- **Available**: `ITimeTickerManager` and `ICronTickerManager` for queuing jobs
- **Available**: `ITickerQHostScheduler` (no-op implementation)
- **Available**: `ITickerQDispatcher` (no-op implementation, `IsEnabled = false`)
- **Not Available**: Actual job processing and execution

Jobs queued in this mode will be stored (in-memory or database) but won't execute until processed by an application with background services enabled.

## Use Cases

### Web API for Job Queuing Only

Run a lightweight API server that only queues jobs, with separate worker instances processing them:

```csharp
// API Server - queue-only mode
builder.Services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    options.DisableBackgroundServices();
    options.IgnoreSeedDefinedCronTickers(); // The Worker will seed these.
});

// Worker Server - with processing
builder.Services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    // Default: background services enabled
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.MaxConcurrency = 20;
    });
});
```

### Microservices Architecture

Separate job creation from job processing across different services:

```csharp
// Order Service - creates jobs, doesn't process
builder.Services.AddTickerQ<OrderTimeTicker, OrderCronTicker>(options =>
{
    options.DisableBackgroundServices();
});

// Worker Service - processes jobs
builder.Services.AddTickerQ<OrderTimeTicker, OrderCronTicker>(options =>
{
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.NodeIdentifier = "order-worker-01";
    });
});
```

### Database migrations

When using TickerQ in a distributed environment, with a common database for job storage, **only one instance should handle database migrations** to avoid conflicts or race conditions. Typically, the worker service is the natural choice to perform migrations, since it is responsible for job processing.
Instances that only queue jobs, should disable automatic seeding of Cron Tickers by setting the `IgnoreSeedDefinedCronTickers` option:

```csharp
// API Server - disable migrations
builder.Services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    options.DisableBackgroundServices();
    options.IgnoreSeedDefinedCronTickers(); // The Worker will seed these.
    options.AddOperationalStore(efOptions =>
    {
        // Configure shared database for job storage
    });
});
```

### Testing Scenarios

Queue jobs without executing them during tests:

```csharp
services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    options.DisableBackgroundServices();
});

// Jobs can be queued and verified without execution
await timeTickerManager.AddAsync(new TTimeTicker
{
    Function = "TestFunction",
    ExecutionTime = DateTime.UtcNow
});
```

## Behavior Details

### Dispatcher Behavior

When background services are disabled:

```csharp
var dispatcher = serviceProvider.GetRequiredService<ITickerQDispatcher>();

// Returns false - dispatcher is not functional
Console.WriteLine(dispatcher.IsEnabled); // false

// DispatchAsync is a no-op
await dispatcher.DispatchAsync(contexts); // Does nothing
```

### Scheduler Behavior

When background services are disabled:

```csharp
var scheduler = serviceProvider.GetRequiredService<ITickerQHostScheduler>();

// Always returns false
Console.WriteLine(scheduler.IsRunning); // false

// Start/Stop are no-ops
await scheduler.StartAsync(); // Does nothing
await scheduler.StopAsync();  // Does nothing
```

### Manager Behavior

Managers work normally regardless of background services setting:

```csharp
var timeManager = serviceProvider.GetRequiredService<ITimeTickerManager<TTimeTicker>>();

// Works normally - job is persisted
await timeManager.AddAsync(new TTimeTicker
{
    Function = "MyFunction",
    ExecutionTime = DateTime.UtcNow.AddHours(1)
});

// Job won't execute locally, but will be processed by nodes with background services enabled
```

## Combining with Other Options

```csharp
builder.Services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    // Disable background services
    options.DisableBackgroundServices();
    
    // Exception handler still works for manager operations
    options.SetExceptionHandler<MyExceptionHandler>();
    
    // Seeding still works
    options.UseTickerSeeder(
        async timeManager => { /* seed time tickers */ },
        async cronManager => { /* seed cron tickers */ }
    );
});
```

## See Also

- [Start Mode](./start-mode) - Control when processing starts
- [Scheduler Configuration](./scheduler-configuration) - Worker thread settings
- [Core Configuration Overview](./index) - All core configuration options
