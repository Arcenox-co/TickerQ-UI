# Job Fundamentals

This guide covers the fundamental concepts of TickerQ jobs at a high level. For focused guides on specific topics, see:

- [Job Priorities](/concepts/job-priorities)
- [Constructor Injection & TickerQConstructor](/concepts/constructor-injection)

## Job Function Basics

### Function Signature

All TickerQ job functions must follow this pattern:

```csharp
[TickerFunction("FunctionName")]
public async Task FunctionName(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Job logic here
}
```

### Function Context

The `TickerFunctionContext` provides access to job metadata:

```csharp
public class TickerFunctionContext
{
    public Guid Id { get; }                    // Job ID
    public TickerType Type { get; }            // TimeTicker or CronTicker
    public int RetryCount { get; }             // Current retry attempt
    public DateTime ScheduledFor { get; }      // Intended fire time (UTC)
    public bool IsDue { get; }                 // Whether job is due
    public string FunctionName { get; }        // Function name
    public CronOccurrenceOperations CronOccurrenceOperations { get; } // Cron-specific operations
    
    public void RequestCancellation()          // Request cancellation for the current job
}
```

`ScheduledFor` represents the time the job was meant to fire (UTC), not when it actually started executing. This is especially useful for:

- Cron jobs: it reflects the cron boundary (for example, `12:00`, `12:05`, `12:10`).
- Time tickers: it reflects the scheduled execution time, even if the job starts late.

Prefer `ScheduledFor` when anchoring data queries or business logic to a schedule, and use `DateTime.UtcNow` only when you truly need the current wall-clock time.

### Typed Request Context

For easier request handling, use the typed version:

```csharp
[TickerFunction("ProcessOrder")]
public async Task ProcessOrder(
    TickerFunctionContext<OrderRequest> context,
    CancellationToken cancellationToken)
{
    var order = context.Request; // Directly typed request
    await ProcessOrderAsync(order, cancellationToken);
}
```

## Job Priorities (Overview)

TickerQ jobs can be tagged with a priority via `TickerTaskPriority`. Currently, the scheduler treats `LongRunning` specially (runs on a separate long-running path), while `High`, `Normal`, and `Low` are primarily metadata for observability and future scheduling strategies.

See [Job Priorities](/concepts/job-priorities) for details and examples.

## Job Chaining (Overview)

TimeTicker supports parent–child job relationships for multi-step workflows. See [Job Chaining](/concepts/job-chaining) for the full guide on run conditions, fluent builders, and nested chains.

## Job Status Lifecycle

Understanding job status helps with monitoring and debugging:

```
Idle → Queued → InProgress → Done/Failed/Cancelled/Skipped
```

### Status Definitions

| Status | Description |
|--------|-------------|
| `Idle` | Job created but not yet queued |
| `Queued` | Job is in queue waiting to execute |
| `InProgress` | Job is currently executing |
| `Done` | Job completed (executed after due time) |
| `DueDone` | Job completed (executed at due time) |
| `Failed` | Job failed after all retries |
| `Cancelled` | Job was cancelled |
| `Skipped` | Job was skipped (e.g., duplicate prevented) |

## Job Cancellation

Jobs can be cancelled from within the function:

```csharp
[TickerFunction("LongRunningTask")]
public async Task LongRunningTask(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Check cancellation token
    if (cancellationToken.IsCancellationRequested)
        return;
    
    // Or cancel programmatically
    if (shouldCancel)
        context.RequestCancellation();
}
```

## Batch Operations

TimeTickers can be grouped as batches with a parent using `ParentId`:

```csharp
var batchParent = new TimeTickerEntity
{
    Id = Guid.NewGuid(),
    Function = "ProcessBatch",
    ExecutionTime = DateTime.UtcNow,
    // ... other properties
};

var batchChild1 = new TimeTickerEntity
{
    Function = "ProcessItem1",
    ParentId = batchParent.Id,
    RunCondition = RunCondition.OnSuccess
};

var batchChild2 = new TimeTickerEntity
{
    Function = "ProcessItem2",
    ParentId = batchParent.Id,
    RunCondition = RunCondition.OnSuccess
};
```

**Note:** Use `ParentId` to establish parent-child relationships. The `Parent` navigation property is set automatically when the ticker is loaded from the database.

## Request Data Handling

### Creating Request Data

```csharp
// Simple type
var request = TickerHelper.CreateTickerRequest(new EmailRequest
{
    To = "user@example.com",
    Subject = "Welcome",
    Body = "Thanks for joining!"
});

// Complex type
var request = TickerHelper.CreateTickerRequest(new OrderProcessingRequest
{
    OrderId = 12345,
    Items = new[] { /* ... */ },
    CustomerId = 67890
});
```

### Reading Request Data

```csharp
// In job function
var request = await TickerRequestProvider.GetRequestAsync<EmailRequest>(
    context, 
    cancellationToken
);

// Or use typed context
[TickerFunction("ProcessOrder")]
public async Task ProcessOrder(
    TickerFunctionContext<OrderRequest> context,
    CancellationToken cancellationToken)
{
    var order = context.Request; // Already typed
}
```

### Request Serialization

TickerQ uses GZip-compressed JSON serialization for request data. The `TickerHelper` handles all serialization automatically.

## Job Identification

### Function Name

The function name must match exactly between:
- `[TickerFunction("FunctionName")]` attribute
- `Function` property when scheduling

### Job ID

Each job gets a unique `Guid` identifier:

```csharp
var ticker = new TimeTickerEntity
{
    Id = Guid.NewGuid(), // Optional - auto-generated if not set
    Function = "MyJob",
    // ...
};
```

## Next Steps

- [Configure Retry Policies](/concepts/error-handling)
- [Learn About Entity Framework Integration](/features/entity-framework)
- [Explore Dashboard Features](/features/dashboard)
