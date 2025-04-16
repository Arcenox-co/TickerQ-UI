# In-Database Mode

When using **TickerQ.EntityFramework**, jobs are persisted to your database and executed reliably based on stored scheduling rules. This enables features like retries, history, multi-node execution, and time-based triggers.

## Initial Setup

To define a persistent background job:

1. **Create a Public or Internal Class**  
   Your class should have either a parameterless or DI-supported constructor.

2. **Annotate the Method with `[TickerFunction]`**  
   This attribute takes one required parameters:
   - `FunctionName` — a unique identifier for the job

> **Note:** If you set the `CronExpression` directly on the `[TickerFunction]` attribute, it will automatically be seeded into the database as a `CronTicker` when the host starts.


## Example
This example will run based on either a cron expression or a specific execution time, depending on how it's stored:

```csharp
public class MyFirstExample : TickerController
{
    [TickerFunction(FunctionName: "ExampleTicker")]
    public async Task ExampleTicker(TickerFunctionContext<string> tickerContext, CancellationToken cancellationToken)
    {
        Console.WriteLine(tickerContext.Request); // Output Hello
    }
}
```


## Storing Jobs in the Database

### Store a `CronTicker` (Recurring Job)

:::info Steps:
1. Retrieve the `ICronTickerManager<CronTicker>` from dependency injection.
2. Use `AddAsync` to store the job.
:::

```csharp:line-numbers
private readonly ICronTickerManager<CronTicker> _cronTickerManager;

await _cronTickerManager.AddAsync(new CronTicker
{
    Request = TickerHelper.CreateTickerRequest<string>("Hello"),
    Expression = "* * * * *",
    Function = "ExampleTicker",
    Description = $"Short Description",
    Retries = 3,
    RetryIntervals = [20, 60, 100] // set in seconds
});
```

You can also update or delete `CronTicker` jobs as needed:

```csharp
// Update a CronTicker by ID
await _cronTickerManager.UpdateAsync(tickerId, ticker =>
{
    ticker.Description = "Updated cron description";
    ticker.Expression = "*/10 * * * *"; // every 10 minutes
});

// Delete a CronTicker by ID
await _cronTickerManager.DeleteAsync(tickerId);
```

### Store a `TimeTicker` (One-Time or Time-Based Job)

:::info Steps:
1. Retrieve the `ITimeTickerManager<TimeTicker>` from dependency injection.
2. Use `AddAsync` to schedule the job for future execution.
:::

```csharp:line-numbers
private readonly ITimeTickerManager<TimeTicker> _timeTickerManager;

await _timeTickerManager.AddAsync(new TimeTicker
{
    Request = TickerHelper.CreateTickerRequest<string>("Hello"),
    ExecutionTime = DateTime.Now.AddSeconds(45),
    Function = "ExampleTicker",
    Description = $"Short Description",
    Retries = 3,
    RetryIntervals = [20, 60, 100] // set in seconds
});
```

> `TimeTicker` supports second-level precision for exact-time execution.

You can also update or delete `TimeTicker` jobs:

```csharp
// Update a TimeTicker by ID
await _timeTickerManager.UpdateAsync(tickerId, ticker =>
{
    ticker.Description = "Updated description";
    ticker.ExecutionTime = DateTime.Now.AddMinutes(15);
});

// Delete a TimeTicker by ID
await _timeTickerManager.DeleteAsync(tickerId);
```

## Summary

- `CronTicker` enables recurring jobs via cron expressions.
- `TimeTicker` supports delayed or scheduled execution with second-level precision.
- Both support retry policies and are stored in your database.
- You can also update or delete jobs at runtime.
