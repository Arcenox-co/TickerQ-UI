# Core Configuration

Core TickerQ configuration options for scheduler, exception handling, and startup behavior.

## Configuration Sections

### [Scheduler Configuration](./core-configuration/scheduler-configuration)
Configure scheduler behavior including concurrency, timeouts, and node identification.

### [Exception Handling](./core-configuration/exception-handling)
Set up global exception handlers for job execution errors.

### [Start Mode](./core-configuration/start-mode)
Control when TickerQ starts processing jobs.

### [Background Services](./core-configuration/background-services)
Enable or disable background job processing services for queue-only mode.

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
    
    // Exception handling
    options.SetExceptionHandler<MyExceptionHandler>();
});
```

## See Also

- [Scheduler Configuration](./core-configuration/scheduler-configuration) - Detailed scheduler options
- [Exception Handling](./core-configuration/exception-handling) - Global exception handler setup
- [Start Mode](./core-configuration/start-mode) - Application startup control
- [Background Services](./core-configuration/background-services) - Enable or disable background processing
- [Configuration Overview](./index) - All configuration sections

