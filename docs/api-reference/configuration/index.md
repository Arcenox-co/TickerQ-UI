# Configuration Reference

Complete reference for all TickerQ configuration options.

## Configuration Sections

### [Core Configuration](./core-configuration)
TickerOptionsBuilder, scheduler options, and exception handlers.

### [Entity Framework Core](./entity-framework-configuration)
Database persistence, DbContext setup, and migrations.

### [Dashboard Configuration](./dashboard-configuration)
UI setup, authentication, and customization.

### [Redis Configuration](./redis-configuration)
Redis job persistence provider and multi-node coordination.

### [OpenTelemetry Configuration](./opentelemetry-configuration)
Observability and distributed tracing.

## Quick Start Configuration

```csharp
builder.Services.AddTickerQ(options =>
{
    // Core scheduler configuration
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.MaxConcurrency = 10;
        scheduler.SchedulerTimeZone = TimeZoneInfo.Utc;
    });
    
    // Exception handling
    options.SetExceptionHandler<CustomExceptionHandler>();
});
```

## See Also

- [Installation Guide](../../getting-started/installation) - Basic setup
- [Entity Framework](../../features/entity-framework) - Database persistence
- [Dashboard](../../features/dashboard) - UI configuration

