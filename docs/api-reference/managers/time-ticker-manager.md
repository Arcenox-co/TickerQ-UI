# ITimeTickerManager\<TTimeTicker\>

Manages time-based jobs (TimeTicker) - jobs scheduled for specific execution times.

## Type Definition

```csharp
namespace TickerQ.Utilities.Interfaces.Managers;

public interface ITimeTickerManager<TTimeTicker>
    where TTimeTicker : TimeTickerEntity<TTimeTicker>
```

## Method Summary

| Method | Returns | Description |
|--------|---------|-------------|
| `AddAsync(TTimeTicker, CancellationToken)` | `Task<TickerResult<TTimeTicker>>` | Schedule a new TimeTicker job |
| `UpdateAsync(TTimeTicker, CancellationToken)` | `Task<TickerResult<TTimeTicker>>` | Update an existing TimeTicker (only `Idle` status) |
| `DeleteAsync(Guid, CancellationToken)` | `Task<TickerResult<TTimeTicker>>` | Delete a TimeTicker by ID |
| `AddBatchAsync(List<TTimeTicker>, CancellationToken)` | `Task<TickerResult<List<TTimeTicker>>>` | Schedule multiple TimeTicker jobs |
| `UpdateBatchAsync(List<TTimeTicker>, CancellationToken)` | `Task<TickerResult<List<TTimeTicker>>>` | Update multiple TimeTicker jobs |
| `DeleteBatchAsync(List<Guid>, CancellationToken)` | `Task<TickerResult<TTimeTicker>>` | Delete multiple TimeTicker jobs |

## Methods

### AddAsync

Schedule a new TimeTicker job.

**Signature:**
```csharp
Task<TickerResult<TTimeTicker>> AddAsync(
    TTimeTicker entity,
    CancellationToken cancellationToken = default);
```

### UpdateAsync

Update an existing TimeTicker. Only jobs with `Idle` status can be updated.

**Signature:**
```csharp
Task<TickerResult<TTimeTicker>> UpdateAsync(
    TTimeTicker timeTicker,
    CancellationToken cancellationToken = default);
```

### DeleteAsync

Delete a TimeTicker by ID.

**Signature:**
```csharp
Task<TickerResult<TTimeTicker>> DeleteAsync(
    Guid id,
    CancellationToken cancellationToken = default);
```

### AddBatchAsync

Schedule multiple TimeTicker jobs in a single operation.

**Signature:**
```csharp
Task<TickerResult<List<TTimeTicker>>> AddBatchAsync(
    List<TTimeTicker> entities,
    CancellationToken cancellationToken = default);
```

### UpdateBatchAsync

Update multiple TimeTicker jobs.

**Signature:**
```csharp
Task<TickerResult<List<TTimeTicker>>> UpdateBatchAsync(
    List<TTimeTicker> timeTickers,
    CancellationToken cancellationToken = default);
```

### DeleteBatchAsync

Delete multiple TimeTicker jobs by their IDs.

**Signature:**
```csharp
Task<TickerResult<TTimeTicker>> DeleteBatchAsync(
    List<Guid> ids,
    CancellationToken cancellationToken = default);
```

## See Also

- [ICronTickerManager](./cron-ticker-manager) - Cron-based job management
- [TickerResult](./ticker-result) - Result type reference
- [TimeTickerEntity](../entities/time-ticker-entity) - TimeTicker entity properties
