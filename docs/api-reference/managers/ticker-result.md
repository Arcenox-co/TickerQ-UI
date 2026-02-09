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

## Usage

```csharp
var result = await _timeTickerManager.AddAsync(ticker);

if (result.IsSucceeded)
{
    var jobId = result.Result.Id;
    Console.WriteLine($"Job created: {jobId}");
}
else
{
    Console.WriteLine($"Error: {result.Exception?.Message}");
    // result.Exception contains the actual exception (TickerValidatorException, etc.)
}
```

## Common Exception Types

- `TickerValidatorException`: Validation errors (invalid function name, cron expression, etc.)
- `ArgumentNullException`: Null entity provided
- `ArgumentException`: Invalid arguments (e.g., null ExecutionTime)
- Database exceptions: When using EF Core persistence

## Error Handling Patterns

### Basic Error Check

```csharp
var result = await _manager.AddAsync(entity);

if (!result.IsSucceeded)
{
    _logger.LogError(result.Exception, "Operation failed");
    return; // Handle error appropriately
}
```

### Specific Exception Handling

```csharp
var result = await _manager.AddAsync(entity);

if (!result.IsSucceeded)
{
    switch (result.Exception)
    {
        case TickerValidatorException ex:
            _logger.LogWarning("Validation error: {Message}", ex.Message);
            break;
        case ArgumentNullException:
            _logger.LogError("Null entity provided");
            break;
        default:
            _logger.LogError(result.Exception, "Unexpected error");
            break;
    }
}
```

### Using Affected Rows

For update and delete operations:

```csharp
var result = await _manager.UpdateAsync(entity);

if (result.IsSucceeded)
{
    Console.WriteLine($"Updated {result.AffectedRows} row(s)");
}
```

## See Also

- [ITimeTickerManager](./time-ticker-manager) - Manager interface for TimeTicker
- [ICronTickerManager](./cron-ticker-manager) - Manager interface for CronTicker
- [Error Handling](../../concepts/error-handling) - Comprehensive error handling guide

