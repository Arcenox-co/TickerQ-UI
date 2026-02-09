# Debugging Guide

Learn how to debug and diagnose TickerQ issues effectively.

## Enabling Debug Logging

### Basic Logging Setup

```csharp
builder.Host.ConfigureLogging(logging =>
{
    logging.SetMinimumLevel(LogLevel.Debug);
    logging.AddConsole();
    logging.AddDebug();
});
```

### Structured Logging with Serilog

```csharp
using Serilog;
using Serilog.Events;

builder.Host.UseSerilog((context, config) =>
{
    config
        .MinimumLevel.Debug()
        .MinimumLevel.Override("TickerQ", LogEventLevel.Debug)
        .WriteTo.Console()
        .WriteTo.File("logs/tickerq-.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] {Message}{NewLine}{Exception}");
});
```

## Inspecting Job State

### Check Job Status

```csharp
// With EF Core
public async Task InspectJobAsync(Guid jobId)
{
    var job = await _context.Set<TimeTickerEntity>()
        .AsNoTracking()
        .FirstOrDefaultAsync(t => t.Id == jobId);
    
    if (job != null)
    {
        Console.WriteLine($"Status: {job.Status}");
        Console.WriteLine($"Function: {job.Function}");
        Console.WriteLine($"Execution Time: {job.ExecutionTime}");
        Console.WriteLine($"Executed At: {job.ExecutedAt}");
        Console.WriteLine($"Retry Count: {job.RetryCount}/{job.Retries}");
        Console.WriteLine($"Lock Holder: {job.LockHolder}");
        Console.WriteLine($"Exception: {job.ExceptionMessage}");
    }
}
```

### List All Registered Functions

```csharp
// After UseTickerQ() is called
var functions = TickerFunctionProvider.TickerFunctions;

Console.WriteLine("Registered Functions:");
foreach (var (name, details) in functions)
{
    Console.WriteLine($"  - {name}");
    if (!string.IsNullOrEmpty(details.cronExpression))
    {
        Console.WriteLine($"    Cron: {details.cronExpression}");
    }
    Console.WriteLine($"    Priority: {details.Priority}");
}
```

### Check Next Scheduled Occurrence

```csharp
// Access execution context
var executionContext = app.Services.GetRequiredService<TickerExecutionContext>();
var nextOccurrence = executionContext.GetNextPlannedOccurrence();

if (nextOccurrence.HasValue)
{
    Console.WriteLine($"Next job scheduled for: {nextOccurrence.Value:yyyy-MM-dd HH:mm:ss}");
}
else
{
    Console.WriteLine("No jobs scheduled");
}
```

## Tracing Job Execution

### Add Logging to Job Functions

```csharp
[TickerFunction("MyJob")]
public async Task MyJob(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    _logger.LogInformation("Job {JobId} started", context.Id);
    _logger.LogInformation("Function: {Function}, Retry: {Retry}", 
        context.FunctionName, context.RetryCount);
    
    try
    {
        // Your job logic
        await DoWorkAsync(cancellationToken);
        
        _logger.LogInformation("Job {JobId} completed successfully", context.Id);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Job {JobId} failed", context.Id);
        throw; // Re-throw to trigger retry
    }
}
```

### Track Job Lifecycle

```csharp
// Subscribe to TickerQ notifications (if using Dashboard)
// Or use custom instrumentation

public class JobTracker
{
    private readonly ILogger<JobTracker> _logger;
    
    public void TrackJobCreation(Guid jobId, string functionName)
    {
        _logger.LogInformation("Job created: {JobId}, Function: {Function}", 
            jobId, functionName);
    }
    
    public void TrackJobStart(Guid jobId)
    {
        _logger.LogInformation("Job started: {JobId}", jobId);
    }
    
    public void TrackJobCompletion(Guid jobId, long elapsedMs, bool success)
    {
        _logger.LogInformation("Job completed: {JobId}, Elapsed: {Elapsed}ms, Success: {Success}",
            jobId, elapsedMs, success);
    }
}
```

## Common Error Messages

### "Cannot find TickerFunction with name {name}"

**Cause:** Function name doesn't match or source generator didn't run.

**Debug Steps:**
1. Verify `[TickerFunction]` attribute is present
2. Check function name spelling (case-sensitive)
3. Rebuild the project (clean and rebuild)
4. Check if function is in a referenced assembly

**Solution:**
```csharp
// Correct
[TickerFunction("SendEmail")]  // Must match exactly
public async Task SendEmail(...) { }

// When scheduling
Function = "SendEmail"  // Same name
```

### "Cannot parse expression {expression}"

**Cause:** Invalid cron expression format.

**Debug Steps:**
1. Verify expression is 6-part format
2. Check for syntax errors
3. Test expression with a cron validator

**Solution:**
```csharp
// Wrong (5-part)
Expression = "0 0 * * *"

// Correct (6-part)
Expression = "0 0 0 * * *"
```

### "Ticker ExecutionTime must not be null"

**Cause:** TimeTicker created without `ExecutionTime`.

**Solution:**
```csharp
var ticker = new TimeTickerEntity
{
    Function = "MyJob",
    ExecutionTime = DateTime.UtcNow.AddMinutes(5) // Required!
};
```

## Monitoring Active Jobs

### Check Active Thread Count

If using Dashboard, monitor active threads in real-time. Otherwise:

```csharp
// Access via execution context (internal, but useful for debugging)
var executionContext = app.Services.GetRequiredService<TickerExecutionContext>();
var activeFunctions = executionContext.Functions
    .Where(f => f.Status == TickerStatus.InProgress)
    .Count();

Console.WriteLine($"Active jobs: {activeFunctions}");
```

### List All In-Progress Jobs

```csharp
// With EF Core
var inProgressJobs = await _context.Set<TimeTickerEntity>()
    .Where(t => t.Status == TickerStatus.InProgress)
    .Select(t => new 
    {
        t.Id,
        t.Function,
        t.LockedAt,
        t.LockHolder,
        t.ExecutionTime
    })
    .ToListAsync();

foreach (var job in inProgressJobs)
{
    Console.WriteLine($"In Progress: {job.Function} (ID: {job.Id})");
    Console.WriteLine($"  Locked by: {job.LockHolder}");
    Console.WriteLine($"  Locked at: {job.LockedAt}");
}
```

## Debugging Multi-Node Issues

### Check Node Heartbeats (Redis)

```csharp
var redisContext = app.Services.GetRequiredService<ITickerQRedisContext>();
var deadNodes = await redisContext.GetDeadNodesAsync();

Console.WriteLine($"Dead nodes: {string.Join(", ", deadNodes)}");
```

### Verify Node Registration

```csharp
// Check Redis keys
// Pattern: tickerq:hb:{nodeIdentifier}
// Pattern: tickerq:nodes:registry
```

## Performance Debugging

### Measure Job Execution Time

```csharp
[TickerFunction("PerformanceTest")]
public async Task PerformanceTest(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var stopwatch = Stopwatch.StartNew();
    
    try
    {
        await DoWorkAsync(cancellationToken);
    }
    finally
    {
        stopwatch.Stop();
        _logger.LogInformation("Job {JobId} took {Elapsed}ms", 
            context.Id, stopwatch.ElapsedMilliseconds);
    }
}
```

### Check Concurrency

```csharp
// Monitor thread pool usage
var scheduler = app.Services.GetRequiredService<TickerQTaskScheduler>();
// Note: TickerQTaskScheduler is internal, but you can monitor via dashboard
```

## Debugging Persistence Issues

### EF Core Query Performance

```csharp
// Enable sensitive data logging
options.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
options.EnableSensitiveDataLogging();
options.EnableDetailedErrors();
```

### Check Database Connections

```csharp
// Test connection
await using var context = await _contextFactory.CreateDbContextAsync();
var canConnect = await context.Database.CanConnectAsync();
Console.WriteLine($"Database connected: {canConnect}");
```

## Debugging Dashboard Issues

### Check SignalR Connection

Open browser DevTools Console and look for:
- SignalR connection errors
- Authentication errors
- CORS errors

### Verify Endpoints

```bash
# Test dashboard endpoint
curl http://localhost:5000/tickerq/dashboard

# Test API endpoint
curl http://localhost:5000/tickerq/dashboard/api/options
```

## Diagnostic Tools

### Create Diagnostic Endpoint

```csharp
app.MapGet("/diagnostics/tickerq", (IServiceProvider services) =>
{
    var result = new
    {
        ServicesRegistered = new
        {
            TimeManager = services.GetService<ITimeTickerManager<TimeTickerEntity>>() != null,
            CronManager = services.GetService<ICronTickerManager<CronTickerEntity>>() != null,
        },
        RegisteredFunctions = TickerFunctionProvider.TickerFunctions.Keys.ToArray(),
        NextOccurrence = services.GetService<TickerExecutionContext>()
            ?.GetNextPlannedOccurrence()
    };
    
    return Results.Ok(result);
});
```

### Health Check Integration

```csharp
builder.Services.AddHealthChecks()
    .AddCheck("tickerq", () =>
    {
        // Check if TickerQ services are registered
        var timeManager = app.Services.GetService<ITimeTickerManager<TimeTickerEntity>>();
        return timeManager != null 
            ? HealthCheckResult.Healthy() 
            : HealthCheckResult.Unhealthy("TickerQ not configured");
    });
```

## Best Practices

1. **Always Log Job Start/End**: Add logging to track job execution
2. **Use Structured Logging**: Makes searching and filtering easier
3. **Monitor Exception Types**: Track which exceptions occur most
4. **Set Up Alerts**: Alert on high failure rates
5. **Regular Health Checks**: Monitor job queue health
6. **Log Context**: Include job ID, function name, retry count in logs

## See Also

- [Common Issues](/troubleshooting/common-issues) - Solutions to frequent problems
- [Error Handling](/concepts/error-handling) - Comprehensive error handling guide
- [Dashboard](/features/dashboard) - Real-time monitoring
- [OpenTelemetry](/features/opentelemetry) - Distributed tracing
