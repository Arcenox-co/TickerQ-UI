# ICronTickerManager\<TCronTicker\>

Manages cron-based jobs (CronTicker) - recurring jobs using cron expressions.

## Type Definition

```csharp
namespace TickerQ.Utilities.Interfaces.Managers;

public interface ICronTickerManager<TCronTicker>
    where TCronTicker : CronTickerEntity
```

## Method Summary

| Method | Returns | Description |
|--------|---------|-------------|
| `AddAsync(TCronTicker, CancellationToken)` | `Task<TickerResult<TCronTicker>>` | Schedule a new CronTicker job |
| `UpdateAsync(TCronTicker, CancellationToken)` | `Task<TickerResult<TCronTicker>>` | Update an existing CronTicker |
| `DeleteAsync(Guid, CancellationToken)` | `Task<TickerResult<TCronTicker>>` | Delete a CronTicker by ID |
| `AddBatchAsync(List<TCronTicker>, CancellationToken)` | `Task<TickerResult<List<TCronTicker>>>` | Schedule multiple CronTicker jobs |
| `UpdateBatchAsync(List<TCronTicker>, CancellationToken)` | `Task<TickerResult<List<TCronTicker>>>` | Update multiple CronTicker jobs |
| `DeleteBatchAsync(List<Guid>, CancellationToken)` | `Task<TickerResult<TCronTicker>>` | Delete multiple CronTicker jobs |

## Methods

### AddAsync

Schedule a new CronTicker job.

**Signature:**
```csharp
Task<TickerResult<TCronTicker>> AddAsync(
    TCronTicker entity,
    CancellationToken cancellationToken = default);
```

**Validation:**
- Function name must exist (registered via `[TickerFunction]`)
- Cron expression must be valid 6-part format
- Expression must be parseable

### UpdateAsync

Update an existing CronTicker (e.g., change cron expression).

**Signature:**
```csharp
Task<TickerResult<TCronTicker>> UpdateAsync(
    TCronTicker cronTicker,
    CancellationToken cancellationToken = default);
```

**Note:** Updating a CronTicker automatically recalculates the next occurrence and updates any pending occurrences.

### DeleteAsync

Delete a CronTicker by ID.

**Signature:**
```csharp
Task<TickerResult<TCronTicker>> DeleteAsync(
    Guid id,
    CancellationToken cancellationToken = default);
```

### AddBatchAsync

Schedule multiple CronTicker jobs in a single operation.

**Signature:**
```csharp
Task<TickerResult<List<TCronTicker>>> AddBatchAsync(
    List<TCronTicker> entities,
    CancellationToken cancellationToken = default);
```

### UpdateBatchAsync

Update multiple CronTicker jobs.

**Signature:**
```csharp
Task<TickerResult<List<TCronTicker>>> UpdateBatchAsync(
    List<TCronTicker> cronTickers,
    CancellationToken cancellationToken = default);
```

### DeleteBatchAsync

Delete multiple CronTicker jobs by their IDs.

**Signature:**
```csharp
Task<TickerResult<TCronTicker>> DeleteBatchAsync(
    List<Guid> ids,
    CancellationToken cancellationToken = default);
```

## See Also

- [ITimeTickerManager](./time-ticker-manager) - Time-based job management
- [TickerResult](./ticker-result) - Result type reference
- [CronTickerEntity](../entities/cron-ticker-entity) - CronTicker entity properties
- [Job Types](../../concepts/job-types) - Understanding cron jobs

