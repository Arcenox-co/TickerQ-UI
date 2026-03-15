# Enums

Reference for all TickerQ enumeration types.

## TickerStatus

Job execution status values.

```csharp
public enum TickerStatus
{
    Idle,           // Created but not yet queued
    Queued,         // In queue waiting to execute
    InProgress,     // Currently executing
    Done,           // Completed (executed after due time)
    DueDone,        // Completed (executed at due time)
    Failed,         // Failed after all retries
    Cancelled,      // Cancelled by user/system
    Skipped         // Skipped (e.g., duplicate prevented)
}
```

### Status Flow

```
Idle → Queued → InProgress → Done/Failed/Cancelled/Skipped
```

### Status Descriptions

| Status | Description | Can Update? | Can Delete? |
|--------|-------------|-------------|------------|
| `Idle` | Created but not yet queued | Yes | Yes |
| `Queued` | Waiting in queue to execute | No | Yes |
| `InProgress` | Currently executing | No | No |
| `Done` | Completed (executed after due time) | No | Yes |
| `DueDone` | Completed (executed exactly at due time) | No | Yes |
| `Failed` | Failed after all retries exhausted | No | Yes |
| `Cancelled` | Cancelled by user or system | No | Yes |
| `Skipped` | Skipped due to conditions (duplicate, etc.) | No | Yes |

## RunCondition

Condition for child job execution based on parent status.

```csharp
public enum RunCondition
{
    OnSuccess,              // Run if parent succeeds
    OnFailure,              // Run if parent fails
    OnCancelled,            // Run if parent is cancelled
    OnFailureOrCancelled,   // Run if parent fails or cancelled
    OnAnyCompletedStatus,   // Run after parent completes (any terminal status)
    InProgress              // Run in parallel with parent
}
```

### Condition Behavior

| Condition | When Child Runs | Parent Status |
|-----------|----------------|---------------|
| `OnSuccess` | Parent completes successfully | `DueDone` or `Done` |
| `OnFailure` | Parent fails after all retries | `Failed` |
| `OnCancelled` | Parent is cancelled | `Cancelled` |
| `OnFailureOrCancelled` | Parent fails or is cancelled | `Failed` or `Cancelled` |
| `OnAnyCompletedStatus` | Parent reaches any terminal status | `Done`, `DueDone`, `Failed`, `Cancelled`, `Skipped` |
| `InProgress` | Runs in parallel with parent | Any (runs immediately) |

## TickerTaskPriority

Execution priority for jobs.

```csharp
public enum TickerTaskPriority
{
    LongRunning,    // Executes in separate thread pool
    High,           // Highest priority
    Normal,         // Default priority
    Low             // Lowest priority
}
```

### Priority Behavior

- `High`: Executed before `Normal` and `Low` priority jobs
- `Normal`: Default priority (most common)
- `Low`: Executed after higher priority jobs
- `LongRunning`: Executes in separate thread pool (doesn't block other jobs)

## TickerQStartMode

Controls when TickerQ starts processing jobs.

```csharp
public enum TickerQStartMode
{
    Immediate,  // Start processing when UseTickerQ is called (default)
    Manual      // Register services but wait for manual start via ITickerQHostScheduler
}
```

| Value | Description |
|-------|-------------|
| `Immediate` | Start job processing immediately when `UseTickerQ()` is called. Background services are registered and start automatically |
| `Manual` | Background services are registered but skip the first run. Job processing needs to be started manually via `ITickerQHostScheduler.StartAsync()` |

See [Start Mode Configuration](/api-reference/configuration/core-configuration/start-mode) and [ITickerQHostScheduler](/api-reference/host-scheduler) for usage.

## TickerType

Identifies the type of ticker being executed. Available in `TickerFunctionContext.Type`.

```csharp
public enum TickerType
{
    CronTickerOccurrence,  // Execution of a cron-scheduled job
    TimeTicker             // Execution of a time-based job
}
```

| Value | Description |
|-------|-------------|
| `CronTickerOccurrence` | A single execution occurrence of a cron ticker |
| `TimeTicker` | A one-time scheduled job execution |

## See Also

- [TimeTickerEntity](./time-ticker-entity) - Uses TickerStatus and RunCondition
- [CronTickerOccurrenceEntity](./cron-occurrence-entity) - Uses TickerStatus
- [TickerFunctionContext](/api-reference/context) - Uses TickerType
- [ITickerExceptionHandler](/api-reference/exception-handling) - Uses TickerType
- [Job Fundamentals](../../concepts/job-fundamentals) - Understanding job relationships and priorities

