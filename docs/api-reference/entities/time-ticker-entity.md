# TimeTickerEntity&lt;TTimeTicker&gt;

Entity for time-based job scheduling (one-time or specific date/time jobs).

## Type Definition

```csharp
public class TimeTickerEntity : TimeTickerEntity<TimeTickerEntity> { }

public class TimeTickerEntity<TTicker> : BaseTickerEntity 
    where TTicker : TimeTickerEntity<TTicker>
{
    // Properties...
}
```

## Properties

| Property | Type | Access | Description |
|---------|------|--------|-------------|
| `Status` | `TickerStatus` | Internal | Current execution status |
| `ExecutionTime` | `DateTime?` | Read/Write | When to execute the job (converted to UTC) |
| `Request` | `byte[]` | Read/Write | Serialized request data (use `TickerHelper.CreateTickerRequest`) |
| `ExecutedAt` | `DateTime?` | Internal | When the job was actually executed |
| `ElapsedTime` | `long` | Internal | Execution time in milliseconds |
| `Retries` | `int` | Read/Write | Maximum number of retry attempts |
| `RetryCount` | `int` | Internal | Current retry attempt number |
| `RetryIntervals` | `int[]` | Read/Write | Retry intervals in seconds |
| `ParentId` | `Guid?` | Internal | Parent job ID (for child jobs) |
| `Parent` | `TTicker` | Navigation | Parent job entity |
| `Children` | `ICollection&lt;TTicker&gt;` | Read/Write | Child jobs collection |
| `RunCondition` | `RunCondition?` | Read/Write | Condition for child job execution |
| `LockHolder` | `string` | Internal | Node/machine that locked the job |
| `LockedAt` | `DateTime?` | Internal | When the job was locked |
| `ExceptionMessage` | `string` | Internal | Exception details if job failed |
| `SkippedReason` | `string` | Internal | Reason if job was skipped |

## Status Values

See [TickerStatus enum](./enums#tickerstatus) for all possible status values.

**Status Flow:**
```
Idle → Queued → InProgress → Done/Failed/Cancelled/Skipped
```

## Relationships

- **Parent-Child**: Supports hierarchical job relationships
- **Children**: Can have up to 5 direct children
- **Grandchildren**: Children can have up to 5 grandchildren each

## Property Constraints

- `Function` - Must not be null or empty, must match `[TickerFunction]` attribute
- `ExecutionTime` - Required for scheduling (auto-set to `UtcNow.AddSeconds(1)` if null)
- Cannot update if status is `InProgress`

## See Also

- [CronTickerEntity](./cron-ticker-entity) - Cron-based jobs
- [Manager APIs](../managers/time-ticker-manager) - Creating and managing TimeTicker jobs
- [Job Types](../../concepts/job-types) - Understanding TimeTicker vs CronTicker

