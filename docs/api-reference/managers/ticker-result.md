# TickerResult&lt;TEntity&gt;

Result type for all manager operations. Provides success status, result data, and exception information.

## Type Definition

```csharp
public class TickerResult<TEntity> where TEntity : class
{
    public readonly bool IsSucceeded;
    public readonly int AffectedRows;
    public readonly TEntity Result;
    public readonly Exception Exception;
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `IsSucceeded` | `bool` | `true` if operation succeeded, `false` otherwise |
| `AffectedRows` | `int` | Number of database rows affected (for update/delete operations) |
| `Result` | `TEntity` | The entity returned (created/updated entity) |
| `Exception` | `Exception` | Exception thrown if operation failed |

## Common Exception Types

- `TickerValidatorException`: Validation errors (invalid function name, cron expression, etc.)
- `ArgumentNullException`: Null entity provided
- `ArgumentException`: Invalid arguments (e.g., null ExecutionTime)
- Database exceptions: When using EF Core persistence

## See Also

- [ITimeTickerManager](./time-ticker-manager) - Manager interface for TimeTicker
- [ICronTickerManager](./cron-ticker-manager) - Manager interface for CronTicker
- [Error Handling](../../concepts/error-handling) - Comprehensive error handling guide

