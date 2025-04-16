# Host API

The `ITickerHost` interface allows you to control the execution lifecycle of TickerQ at runtime. It can be retrieved via dependency injection.

## Injecting ITickerHost

```csharp
private readonly ITickerHost _tickerHost;
```

## Available Methods

```csharp
_tickerHost.Start(); // Starts the TickerQ loop
_tickerHost.Restart(); // Force restarts the TickerQ scheduler
_tickerHost.RestartIfNeeded(newOccurrence); // Restarts only if newOccurrence is earlier than current NextPlannedOccurrence
_tickerHost.Stop(); // Stops the scheduler loop
bool isRunning = _tickerHost.IsRunning(); // Checks if the loop is running
DateTime? next = _tickerHost.NextPlannedOccurrence; // Gets the next scheduled execution
```

## Notes

:::tip Default Behavior
- The `Start()` method is automatically invoked when the application launches.
- You usually don't need to call it manually unless you're starting it conditionally.
:::

Use these methods to add custom uptime logic, diagnostics, or admin controls for your background scheduler.
