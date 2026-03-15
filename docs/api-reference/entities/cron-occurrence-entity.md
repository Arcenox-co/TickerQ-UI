# CronTickerOccurrenceEntity&lt;TCronTicker&gt;

Represents a single execution occurrence of a CronTicker.

## Type Definition

```csharp
public class CronTickerOccurrenceEntity<TCronTicker> 
    where TCronTicker : CronTickerEntity
{
    public Guid Id { get; set; }
    public Guid CronTickerId { get; set; }
    public TickerStatus Status { get; set; }
    public DateTime ExecutionTime { get; set; }
    public DateTime? ExecutedAt { get; set; }
    public long ElapsedTime { get; set; }
    public int RetryCount { get; set; }
    public string LockHolder { get; set; }
    public DateTime? LockedAt { get; set; }
    public string ExceptionMessage { get; set; }
    public string SkippedReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public TCronTicker CronTicker { get; set; }
}
```

## Properties

| Property | Type | Description |
|---------|------|-------------|
| `Id` | `Guid` | Unique occurrence identifier |
| `CronTickerId` | `Guid` | Parent CronTicker ID |
| `Status` | `TickerStatus` | Execution status (Idle, Queued, InProgress, Done, Failed, etc.) |
| `ExecutionTime` | `DateTime` | Scheduled execution time |
| `ExecutedAt` | `DateTime?` | Actual execution time |
| `ElapsedTime` | `long` | Execution duration in milliseconds |
| `RetryCount` | `int` | Retry attempts made |
| `LockHolder` | `string` | Node that locked this occurrence |
| `LockedAt` | `DateTime?` | Lock timestamp |
| `ExceptionMessage` | `string` | Exception details if failed |
| `SkippedReason` | `string` | Skip reason if skipped |
| `CreatedAt` | `DateTime` | Creation timestamp |
| `UpdatedAt` | `DateTime` | Last update timestamp |
| `CronTicker` | `TCronTicker` | Navigation property to parent CronTicker |

## Notes

- Occurrences are created automatically when a CronTicker should execute
- Each occurrence tracks individual execution status
- Occurrences can be queried to view execution history
- Multiple occurrences can exist for the same CronTicker (past, present, future)

## Relationship

```
CronTickerEntity
└── CronTickerOccurrenceEntity (created for each execution)
    └── CronTickerOccurrenceEntity (next execution)
    └── ...
```

## See Also

- [CronTickerEntity](./cron-ticker-entity) - Parent entity
- [Enums](./enums#tickerstatus) - Status values
- [Entity Framework](../../features/entity-framework) - Querying occurrences

