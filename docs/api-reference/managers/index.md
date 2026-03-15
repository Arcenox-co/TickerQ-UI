# Manager APIs

TickerQ provides manager interfaces for scheduling and managing jobs. This guide covers all available APIs in the manager interfaces.

::: tip Accessing Entities
To query or retrieve entities by ID, use the persistence provider methods directly or access them through Entity Framework if you're using EF Core persistence.
:::

## Manager Types

### [ITimeTickerManager](./time-ticker-manager)
Manages time-based jobs (TimeTicker) - jobs scheduled for specific execution times.

### [ICronTickerManager](./cron-ticker-manager)
Manages cron-based jobs (CronTicker) - recurring jobs using cron expressions.

## [TickerResult](./ticker-result)
Result type returned by all manager operations, providing success status and exception information.

## See Also

- [Entity Reference](../entities/index) - Complete entity properties documentation
- [Configuration Reference](../configuration/index) - All configuration options
- [Job Types](../../concepts/job-types) - Understanding TimeTicker vs CronTicker

