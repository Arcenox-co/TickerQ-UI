# Entity Reference

Complete reference for all TickerQ entity types, their properties, and relationships.

## Entity Types

### [BaseTickerEntity](./base-entity)
Base class for all ticker entities with common properties.

### [TimeTickerEntity](./time-ticker-entity)
Entity for time-based job scheduling (one-time or specific date/time jobs).

### [CronTickerEntity](./cron-ticker-entity)
Entity for cron-based recurring job scheduling.

### [CronTickerOccurrenceEntity](./cron-occurrence-entity)
Represents a single execution occurrence of a CronTicker.

### [Enums](./enums)
TickerStatus, RunCondition, and TickerTaskPriority enumerations.

## See Also

- [Manager APIs](../managers/index) - Methods to create and manage entities
- [Job Types](../../concepts/job-types) - When to use TimeTicker vs CronTicker
- [Job Fundamentals](../../concepts/job-fundamentals) - Understanding job relationships

