# TickerFunctionContext

The context object passed to every ticker function. Contains metadata about the current execution and operations for controlling behavior.

## Type Definition

```csharp
namespace TickerQ.Utilities.Base;

public class TickerFunctionContext { }
public class TickerFunctionContext<TRequest> : TickerFunctionContext { }
```

## TickerFunctionContext Properties

| Property | Type | Description |
|----------|------|-------------|
| `Id` | `Guid` | Unique identifier of the ticker being executed |
| `Type` | `TickerType` | Whether this is a `TimeTicker` or `CronTickerOccurrence` |
| `RetryCount` | `int` | Current retry attempt number (0 on first execution) |
| `IsDue` | `bool` | Whether the ticker was already past its scheduled time when picked up |
| `ScheduledFor` | `DateTime` | The UTC time this ticker was scheduled to run. For time tickers, this is `ExecutionTime`; for cron tickers, the occurrence `ExecutionTime` |
| `FunctionName` | `string` | The name of the function being executed (matches the `[TickerFunction]` name) |
| `CronOccurrenceOperations` | `CronOccurrenceOperations` | Operations available only for cron ticker executions (see below) |

## TickerFunctionContext\<TRequest\> Properties

Inherits all properties from `TickerFunctionContext`, plus:

| Property | Type | Description |
|----------|------|-------------|
| `Request` | `TRequest` | The deserialized request payload passed when the ticker was created |

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `RequestCancellation()` | `void` | Requests cancellation of the current ticker execution. Triggers the cancellation token associated with this ticker |

## CronOccurrenceOperations

Available via `context.CronOccurrenceOperations` when executing a cron ticker function.

| Method | Returns | Description |
|--------|---------|-------------|
| `SkipIfAlreadyRunning()` | `void` | If another instance of this cron occurrence is already executing, skip this execution with `Skipped` status instead of running concurrently. For queuing behavior instead of skipping, use `maxConcurrency` on `[TickerFunction]` |

## See Also

- [Attributes](/api-reference/attributes) — Configuring ticker functions
- [Enums](/api-reference/entities/enums) — `TickerType`, `TickerStatus`
- [Job Fundamentals](/concepts/job-fundamentals) — How ticker functions work
