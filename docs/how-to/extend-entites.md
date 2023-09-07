# Extend Default Entities

<div class="danger custom-block" style="padding-top:8px;">
    <p>This feature is available exclusively through the extension package: TickerQ.EntityFrameworkCore.</p>
</div>

## Extend `Cron and Time` Ticker
Create your class `Entity` and inherit it, then simply add your desire properties.

```csharp

public class MyCronTicker : CronTicker 
{
    public string Description { get; set; }
}

public class MyTimeTicker : TimeTicker 
{
    public string Description { get; set; }
}

```
:::info Register your Entities
* After doing as the above example, add it at `TickerQ` Config.
```csharp
....
services.AddTicker(opt =>
{
    options.AddOperationalStore<MyDbContext, MyTimeTicker, MyCronTicker>(); // [!code focus]
});
```
* You have to run add-migration command in order the changes to take effect.
```PM
PM> add-migration "InitialCreate" -c MyDbContext
```
:::

:::tip Note
By default Ticker entities are stored in `schema: Ticker` with minimal configurations you can adjust it by using `EFCore Configurations`.
:::