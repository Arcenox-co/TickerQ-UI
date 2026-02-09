# Exception Handling

Configure global exception handlers for TickerQ job execution errors.

## SetExceptionHandler

Register a global exception handler that processes all job execution exceptions.

**Method:**
```csharp
TickerOptionsBuilder<TTimeTicker, TCronTicker> SetExceptionHandler<THandler>() 
    where THandler : ITickerExceptionHandler;
```

**Example:**
```csharp
options.SetExceptionHandler<MyExceptionHandler>();
```

## Requirements

- Handler must implement `ITickerExceptionHandler` interface
- Handler is registered as a singleton service
- Handler is invoked for all job execution exceptions

## ITickerExceptionHandler Interface

```csharp
public interface ITickerExceptionHandler
{
    Task HandleExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType);

    Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType);
}
```

**Methods:**

| Method | Description |
|--------|-------------|
| `HandleExceptionAsync` | Called when a job throws an exception during execution |
| `HandleCanceledExceptionAsync` | Called when a job is cancelled (TaskCanceledException or OperationCanceledException) |

## Example Implementation

```csharp
using TickerQ.Utilities.Interfaces;
using TickerQ.Utilities.Enums;

public class MyExceptionHandler : ITickerExceptionHandler
{
    private readonly ILogger<MyExceptionHandler> _logger;
    private readonly IEmailService _emailService;

    public MyExceptionHandler(
        ILogger<MyExceptionHandler> logger,
        IEmailService emailService)
    {
        _logger = logger;
        _emailService = emailService;
    }

    public async Task HandleExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        // Log the error
        _logger.LogError(exception,
            "Job {TickerId} ({TickerType}) failed",
            tickerId, tickerType);

        // Send notification for critical errors
        if (exception is CriticalBusinessException)
        {
            await _emailService.SendAsync(new EmailMessage
            {
                To = "admin@example.com",
                Subject = $"Critical Job Failure: {tickerId}",
                Body = $"Job ID: {tickerId}\nType: {tickerType}\nError: {exception.Message}"
            });
        }

        // Store error details in database
        await StoreErrorDetailsAsync(tickerId, exception);
    }

    public async Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogWarning(
            "Job {TickerId} ({TickerType}) was cancelled",
            tickerId, tickerType);

        // Optional: Track cancellation metrics
        await Task.CompletedTask;
    }

    private async Task StoreErrorDetailsAsync(Guid tickerId, Exception exception)
    {
        // Your error storage logic
        await Task.CompletedTask;
    }
}
```

## Configuration

```csharp
builder.Services.AddTickerQ(options =>
{
    options.SetExceptionHandler<MyExceptionHandler>();
    
    // Other configuration...
});
```

## Exception Handler Scenarios

### Logging Only

```csharp
public class LoggingExceptionHandler : ITickerExceptionHandler
{
    private readonly ILogger<LoggingExceptionHandler> _logger;

    public LoggingExceptionHandler(ILogger<LoggingExceptionHandler> logger)
    {
        _logger = logger;
    }

    public Task HandleExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogError(exception,
            "Job {TickerId} ({TickerType}) failed",
            tickerId, tickerType);

        return Task.CompletedTask;
    }

    public Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogWarning(
            "Job {TickerId} ({TickerType}) was cancelled",
            tickerId, tickerType);

        return Task.CompletedTask;
    }
}
```

### Notification Handler

```csharp
public class NotificationExceptionHandler : ITickerExceptionHandler
{
    private readonly IEmailService _emailService;
    private readonly ILogger<NotificationExceptionHandler> _logger;

    public NotificationExceptionHandler(
        IEmailService emailService,
        ILogger<NotificationExceptionHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task HandleExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogError(exception, "Job {TickerId} failed", tickerId);

        // Send alert for all failures
        await _emailService.SendAlertAsync(new AlertMessage
        {
            Severity = AlertSeverity.High,
            Message = $"Job {tickerId} ({tickerType}) failed",
            Details = exception.ToString()
        });
    }

    public async Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogWarning("Job {TickerId} was cancelled", tickerId);
        await Task.CompletedTask;
    }
}
```

### Metrics and Monitoring

```csharp
public class MetricsExceptionHandler : ITickerExceptionHandler
{
    private readonly IMetricsCollector _metrics;

    public MetricsExceptionHandler(IMetricsCollector metrics)
    {
        _metrics = metrics;
    }

    public Task HandleExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _metrics.IncrementCounter("tickerq.job.failures", new Dictionary<string, string>
        {
            { "ticker_id", tickerId.ToString() },
            { "ticker_type", tickerType.ToString() },
            { "exception_type", exception.GetType().Name }
        });

        return Task.CompletedTask;
    }

    public Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _metrics.IncrementCounter("tickerq.job.cancellations", new Dictionary<string, string>
        {
            { "ticker_id", tickerId.ToString() },
            { "ticker_type", tickerType.ToString() }
        });

        return Task.CompletedTask;
    }
}
```

## Error Handling Flow

1. **Job execution fails** → Exception thrown
2. **Retry logic** → Attempts retries (if configured)
3. **After retries exhausted** → `HandleExceptionAsync` is called
4. **Handler processes error** → Logging, notifications, etc.
5. **Job marked as Failed** → Status updated in database

## Best Practices

1. **Always log errors** - Include ticker ID and ticker type in logs
2. **Handle exceptions gracefully** - Don't throw from handler
3. **Implement both methods** - `HandleExceptionAsync` and `HandleCanceledExceptionAsync` are both required
4. **Avoid blocking operations** - Use async/await properly
5. **Include job context** - Ticker ID and ticker type are valuable for debugging

## When No Handler Is Set

If no exception handler is configured:
- Exceptions are still logged through the default instrumentation
- Jobs are marked as `Failed` in the database
- No custom processing occurs

## See Also

- [Start Mode](./start-mode) - Application startup control
- [Scheduler Configuration](./scheduler-configuration) - Scheduler options
- [Core Configuration Overview](./index) - All core configuration options

