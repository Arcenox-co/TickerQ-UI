# Core Configuration

Core TickerQ configuration options for scheduler, exception handling, and startup behavior.

## Configuration Sections

### [Scheduler Configuration](./scheduler-configuration)
Configure scheduler behavior including concurrency, timeouts, and node identification.

### [Exception Handling](./exception-handling)
Set up global exception handlers for job execution errors.

### [Start Mode](./start-mode)
Control when TickerQ starts processing jobs.

### [Background Services](./background-services)
Enable or disable background job processing services for queue-only mode.

### Request Serialization
Control how ticker request payloads are serialized and stored (plain JSON bytes or GZip-compressed).

### Seeding
Control automatic and custom seeding of jobs for both in-memory and EF Core providers.

## Quick Example

```csharp
builder.Services.AddTickerQ<TTimeTicker, TCronTicker>(options =>
{
    // Scheduler configuration
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.MaxConcurrency = 10;
        scheduler.NodeIdentifier = "production-server-01";
    });
    
    // Request serialization
    // By default, requests are stored as plain UTF-8 JSON bytes.
    // Call UseGZipCompression to reduce payload size at the cost of CPU.
    options.UseGZipCompression();
    
    // Exception handling
    options.SetExceptionHandler<MyExceptionHandler>();

    // Seeding (works with both in-memory and EF Core providers)
    // Disable auto seeding of code-defined cron tickers:
    options.IgnoreSeedDefinedCronTickers();

    // Custom seeding for time and cron tickers:
    options.UseTickerSeeder(
        async timeManager =>
        {
            // Seed initial TimeTicker jobs
            await timeManager.AddAsync(new TimeTickerEntity
            {
                Function = "InitialCleanup",
                ExecutionTime = DateTime.UtcNow.AddMinutes(5)
            });
        },
        async cronManager =>
        {
            // Seed initial CronTicker jobs
            await cronManager.AddAsync(new CronTickerEntity
            {
                Function = "NightlyMaintenance",
                Expression = "0 0 2 * * *" // Every day at 02:00
            });
        });
});
```

## See Also

- [Scheduler Configuration](./scheduler-configuration) - Detailed scheduler options
- [Exception Handling](./exception-handling) - Global exception handler setup
- [Start Mode](./start-mode) - Application startup control
- [Background Services](./background-services) - Enable or disable background processing
- [Configuration Overview](../index) - All configuration sections
