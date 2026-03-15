# CronTickerEntity

Entity for cron-based recurring job scheduling.

## Type Definition

```csharp
public class CronTickerEntity : BaseTickerEntity
{
    public string Expression { get; set; }
    public byte[] Request { get; set; }
    public int Retries { get; set; }
    public int[] RetryIntervals { get; set; }
    public bool IsEnabled { get; set; } = true;
}
```

## Properties

| Property | Type | Default | Description |
|---------|------|---------|-------------|
| `Expression` | `string` | | Cron expression (6-part format required: `second minute hour day month day-of-week`) |
| `Request` | `byte[]` | | Serialized request data (use `TickerHelper.CreateTickerRequest`) |
| `Retries` | `int` | `0` | Maximum number of retry attempts |
| `RetryIntervals` | `int[]` | | Retry intervals in seconds |
| `IsEnabled` | `bool` | `true` | Whether the cron ticker is active. When `false`, no new occurrences are generated. Can be toggled from the dashboard or programmatically via the manager API. |

## Cron Expression Format

Must be 6-part format: `second minute hour day month day-of-week`

**Examples:**
- `"0 0 0 * * *"` - Daily at midnight
- `"0 0 9 * * *"` - Daily at 9:00 AM
- `"0 */5 * * * *"` - Every 5 minutes
- `"*/10 * * * * *"` - Every 10 seconds
- `"0 0 9,17 * * *"` - At 9 AM and 5 PM daily
- `"0 30 14 * * 1"` - Every Monday at 2:30 PM

::: warning Required Format
All cron expressions must include the seconds field (6 parts). The format is: `second minute hour day month day-of-week`.
:::

## Property Constraints

- `Function` - Must not be null or empty, must match `[TickerFunction]` attribute
- `Expression` - Must be valid 6-part cron expression that is parseable
- Expression must calculate a valid next occurrence

## See Also

- [TimeTickerEntity](./time-ticker-entity) - Time-based jobs
- [CronTickerOccurrenceEntity](./cron-occurrence-entity) - Individual execution occurrences
- [Manager APIs](../managers/cron-ticker-manager) - Creating and managing CronTicker jobs
- [Job Types](../../concepts/job-types) - Understanding cron jobs

