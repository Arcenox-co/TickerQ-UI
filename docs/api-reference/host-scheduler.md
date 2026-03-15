# ITickerQHostScheduler

Interface for programmatically controlling the TickerQ scheduler lifecycle. Inject this to start, stop, or restart job processing at runtime.

## Type Definition

```csharp
namespace TickerQ.Utilities.Interfaces;

public interface ITickerQHostScheduler
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `IsRunning` | `bool` | Whether the scheduler is currently running and processing jobs |

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `StartAsync(CancellationToken cancellationToken = default)` | `Task` | Start the scheduler. Used with `TickerQStartMode.Manual` to begin processing |
| `StopAsync(CancellationToken cancellationToken = default)` | `Task` | Stop the scheduler gracefully. In-progress jobs will complete before shutdown |
| `Restart()` | `void` | Restart the scheduler immediately. Stops and starts processing |
| `RestartIfNeeded(DateTime? dateTime)` | `void` | Restart only if the next scheduled job is before the current wake-up time. Optimizes rescheduling without unnecessary restarts |

## See Also

- [Start Mode](/api-reference/configuration/core-configuration/start-mode) — `Immediate` vs `Manual` modes
- [Scheduler Configuration](/api-reference/configuration/core-configuration/scheduler-configuration) — Concurrency, timeouts, timezone
