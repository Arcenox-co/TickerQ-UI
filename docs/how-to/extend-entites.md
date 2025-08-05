# Extending Default Entities

<div class="danger custom-block" style="padding-top:8px;">
  <p>This feature is available exclusively through the extension package: <strong>TickerQ.EntityFrameworkCore</strong>.</p>
</div>

## Customizing CronTicker & TimeTicker

You can extend the default ticker entities by creating your own classes that inherit from `CronTicker` and `TimeTicker`, and then adding custom properties as needed.

```csharp
public class MyCronTicker : CronTickerEntity 
{
    public string MyProperty { get; set; }
}

public class MyTimeTicker : TimeTickerEntity 
{
    public string MyProperty { get; set; }
}
```

## Registering Custom Tickers

To apply the custom entities, register them in your `AddTickerQ` setup:

```csharp
services.AddTickerQ(options =>
{
    options.AddOperationalStore<MyDbContext, MyTimeTicker, MyCronTicker>();
});
```

After registering, generate the required schema updates by creating a migration:

```powershell
PM> Add-Migration "InitialCreate" -c MyDbContext
```


## Notes on Schema

:::tip Default Behavior
By default, Ticker entities are stored in the `schema: Ticker`. You can override or extend the schema and table mappings using standard EF Core configuration techniques.
:::


Customize your tickers to include domain-specific metadata, flags, or categorization logic for more advanced background job behavior.
