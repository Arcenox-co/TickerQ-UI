# Custom Entity Types

Creating custom entity types that extend base TickerQ entities.

## Custom TimeTicker

Create a custom TimeTicker with additional properties:

```csharp
public class CustomTimeTicker : TimeTickerEntity<CustomTimeTicker>
{
    public string TenantId { get; set; }
    public string UserId { get; set; }
    public string Category { get; set; }
}
```

## Custom CronTicker

Create a custom CronTicker with additional properties:

```csharp
public class CustomCronTicker : CronTickerEntity
{
    public string Category { get; set; }
    public bool IsActive { get; set; }
    public string Environment { get; set; }
}
```

## See Also

- [BaseTickerEntity](./base-entity) - Base class reference
- [TimeTickerEntity](./time-ticker-entity) - Base TimeTicker entity
- [CronTickerEntity](./cron-ticker-entity) - Base CronTicker entity
- [Entity Framework Configuration](../configuration/entity-framework-configuration) - EF Core setup
- [Entity Framework Guide](../../features/entity-framework) - Complete setup guide

