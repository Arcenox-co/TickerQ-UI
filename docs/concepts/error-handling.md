# Error Handling and Retries

TickerQ provides comprehensive error handling and retry mechanisms to ensure reliable job execution.

## Retry Configuration

### Basic Retry Setup

When scheduling a job, configure retries:

```csharp
await _timeTickerManager.AddAsync(new TimeTickerEntity
{
    Function = "ProcessPayment",
    ExecutionTime = DateTime.UtcNow,
    Request = TickerHelper.CreateTickerRequest(paymentData),
    Retries = 3,                              // Maximum 3 retry attempts
    RetryIntervals = new[] { 30, 60, 120 }    // Wait 30s, 60s, then 2min between retries
});
```

### Retry Behavior

- Retries occur automatically when a job throws an exception
- The job status remains `InProgress` during retries
- After all retries are exhausted, status becomes `Failed`
- `RetryCount` property tracks the current retry attempt

### Retry Interval Strategies

#### Fixed Delay
```csharp
RetryIntervals = new[] { 60, 60, 60 }  // Always wait 1 minute
```

#### Exponential Backoff
```csharp
RetryIntervals = new[] { 1, 2, 4, 8, 16, 32 }  // Double each time
```

#### Progressive Backoff
```csharp
RetryIntervals = new[] { 30, 60, 300, 900, 3600 }  // Gradually increase
```

#### Immediate Retry
```csharp
RetryIntervals = new[] { 0, 0, 0 }  // Retry immediately
```

#### Default Behavior
If `RetryIntervals` is not specified or is shorter than `Retries`, TickerQ defaults to 30 seconds between retries.

## Exception Handling

### Global Exception Handler

Implement `ITickerExceptionHandler` to handle all job exceptions:

```csharp
using TickerQ.Utilities.Interfaces;
using TickerQ.Utilities.Enums;

public class CustomExceptionHandler : ITickerExceptionHandler
{
    private readonly ILogger<CustomExceptionHandler> _logger;
    private readonly IEmailService _emailService;
    
    public CustomExceptionHandler(
        ILogger<CustomExceptionHandler> logger,
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
        
        // Send alert for critical jobs
        if (IsCriticalJob(tickerId))
        {
            await _emailService.SendAlertAsync(
                "ops@company.com",
                $"Critical job {tickerId} failed",
                exception.ToString()
            );
        }
    }
    
    public async Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogWarning(
            "Job {TickerId} ({TickerType}) was cancelled",
            tickerId, tickerType);
        // Handle cancellation-specific logic
        await Task.CompletedTask;
    }
    
    private bool IsCriticalJob(Guid tickerId)
    {
        // Your logic to determine if job is critical
        return false;
    }
}
```

### Register Exception Handler

```csharp
builder.Services.AddTickerQ(options =>
{
    options.SetExceptionHandler<CustomExceptionHandler>();
});
```

## Job-Level Error Handling

### Catching Exceptions

Handle exceptions within your job function:

```csharp
[TickerFunction("ProcessOrder")]
public async Task ProcessOrder(
    TickerFunctionContext<OrderRequest> context,
    CancellationToken cancellationToken)
{
    try
    {
        await ProcessOrderAsync(context.Request, cancellationToken);
    }
    catch (PaymentException ex)
    {
        // Log specific error
        _logger.LogError(ex, "Payment failed for order");
        
        // Re-throw to trigger retry
        throw;
    }
    catch (InvalidOrderException ex)
    {
        // Don't retry for invalid data
        _logger.LogError(ex, "Invalid order - not retrying");
        return; // Job completes without retry
    }
    catch (Exception ex)
    {
        // Log and re-throw for retry
        _logger.LogError(ex, "Unexpected error");
        throw;
    }
}
```

### Checking Retry Count

Make decisions based on retry count:

```csharp
[TickerFunction("SendEmail")]
public async Task SendEmail(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var retryCount = context.RetryCount;
    
    _logger.LogInformation("Sending email (Attempt {Attempt})", retryCount + 1);
    
    try
    {
        await EmailService.SendAsync(context.Request, cancellationToken);
    }
    catch (SmtpException ex) when (retryCount < 3)
    {
        // Retry for SMTP errors up to 3 times
        _logger.LogWarning("SMTP error, will retry: {Message}", ex.Message);
        throw;
    }
    catch (InvalidEmailException)
    {
        // Don't retry for invalid emails
        _logger.LogError("Invalid email address, not retrying");
        return;
    }
}
```

## Job Status After Errors

### Failed Status

A job is marked as `Failed` when:
- All retry attempts are exhausted
- An exception is thrown and not caught (or caught and re-thrown)

```csharp
// Access failed job details
var ticker = await _timeTickerManager.GetByIdAsync(jobId);
if (ticker.Status == TickerStatus.Failed)
{
    var exceptionMessage = ticker.ExceptionMessage;
    var retryCount = ticker.RetryCount;
    // Handle failed job
}
```

### Cancelled Status

A job is marked as `Cancelled` when:
- `CancellationToken` is triggered
- `context.RequestCancellation()` is called

```csharp
[TickerFunction("LongRunningTask")]
public async Task LongRunningTask(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    if (cancellationToken.IsCancellationRequested)
    {
        // Job will be marked as Cancelled
        return;
    }
    
    // Or cancel programmatically
    if (shouldCancel)
        context.RequestCancellation();
}
```

### Skipped Status

A job is marked as `Skipped` when:
- A `TerminateExecutionException` is thrown **without** an explicit status (default)
- Cron occurrence skips because another is already running

```csharp
[TickerFunction("PreventDuplicate")]
public async Task PreventDuplicate(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    if (await IsAlreadyRunningAsync())
    {
        throw new TerminateExecutionException("Job is already running");
        // Job status becomes Skipped
    }
}
```

## TerminateExecutionException

Use `TerminateExecutionException` to terminate a job **without retrying** and optionally control the final status and exception details stored on the ticker.

```csharp
using TickerQ.Exceptions;

[TickerFunction("ProcessData")]
public async Task ProcessData(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Check if processing is already in progress
    if (await IsProcessingAsync())
    {
        throw new TerminateExecutionException(
            "Processing is already in progress"
        );
        // Job will be marked as Skipped (default status), no retries
    }
    
    await ProcessDataAsync(context.Request, cancellationToken);
}
```

### Controlling Status and Exception Details

`TerminateExecutionException` has several overloads:

- `TerminateExecutionException(string message)`  
  Sets status to `TickerStatus.Skipped` and stores `message` as the skip reason.
- `TerminateExecutionException(TickerStatus status, string message)`  
  Sets the ticker status to the given value (for example, `Failed`, `Done`, `Cancelled`) and stores `message`.
- `TerminateExecutionException(string message, Exception innerException)`  
  Keeps status as `Skipped`, but stores details from `innerException` (message/stack) on the ticker.
- `TerminateExecutionException(TickerStatus status, string message, Exception innerException)`  
  Sets a custom status and uses `innerException` to populate exception details.

Example: mark a job as `Failed` with a specific error:

```csharp
if (!IsConfigurationValid())
{
    throw new TerminateExecutionException(
        TickerStatus.Failed,
        "Configuration is invalid for this job");
    // Job will be marked as Failed with the given message, no retries
}
```

## Cron Occurrence Skipping

Prevent concurrent execution of cron occurrences:

```csharp
[TickerFunction("LongRunningTask", cronExpression: "0 0 * * * *")]
public async Task LongRunningTask(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Skip if another occurrence is already running
    context.CronOccurrenceOperations.SkipIfAlreadyRunning();
    
    // This will throw TerminateExecutionException if another
    // occurrence of the same CronTicker is running
    
    await ProcessLongTaskAsync(cancellationToken);
}
```

## Error Logging

### Exception Details

TickerQ automatically serializes exception details:

```csharp
var ticker = await _timeTickerManager.GetByIdAsync(jobId);
if (ticker.Status == TickerStatus.Failed)
{
    // Exception details are stored as JSON
    var exceptionDetails = ticker.ExceptionMessage;
    
    // Contains:
    // - Exception message
    // - Stack trace
    // - Root exception information
}
```

### Structured Logging

TickerQ integrates with `ILogger` for structured logging:

```csharp
// Configure logging in Program.cs
builder.Host.ConfigureLogging(logging =>
{
    logging.AddConsole();
    logging.AddSerilog(); // If using Serilog
    logging.SetMinimumLevel(LogLevel.Information);
});
```

## Best Practices

### 1. Distinguish Transient vs Permanent Failures

```csharp
try
{
    await ExternalService.CallAsync();
}
catch (HttpRequestException ex) when (IsTransientError(ex))
{
    // Transient error - retry
    throw;
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    // Permanent error - don't retry
    _logger.LogError("Resource not found");
    return;
}
```

### 2. Use Appropriate Retry Strategies

- **Network calls**: Exponential backoff
- **Database operations**: Fixed delay with limited retries
- **External APIs**: Progressive backoff
- **Invalid data**: No retries (catch and return)

### 3. Log Sufficient Context

```csharp
_logger.LogError(exception, 
    "Job {FunctionName} ({JobId}) failed on attempt {Attempt}",
    context.FunctionName, 
    context.Id, 
    context.RetryCount + 1);
```

### 4. Monitor Failed Jobs

Use the dashboard or query failed jobs:

```csharp
var failedJobs = await _timeTickerManager.GetTimeTickers(
    t => t.Status == TickerStatus.Failed,
    cancellationToken
);
```

## Next Steps

- [Explore Dashboard for Monitoring](/features/dashboard)
- [Learn About Job Status Tracking](/concepts/job-fundamentals#job-status-lifecycle)
- [Configure OpenTelemetry for Distributed Tracing](/features/opentelemetry)
