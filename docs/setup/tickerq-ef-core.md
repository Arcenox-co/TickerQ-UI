# TickerQ EF Core
## Installation
TickerQ.EntityFrameworkCore is a package that extends the functionality of TickerQ.
>You can install it with:
>::: code-group
>```cli [.NET CLI]
>> dotnet add package TickerQ.EntityFrameworkCore
>```
>```pm [Package Manager]
>PM> NuGet\Install-Package TickerQ.EntityFrameworkCore
>```
>```pm [Package Reference]
><PackageReference Include="TickerQ.EntityFrameworkCore" Version="*" />
>```
>:::


## Configure Options
Add options in TickerQ.
```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
....

services.AddTickerQ(opt =>
{
   // Set fallback time out to check for missed jobs and execute.
  opt.UpdateMissedJobCheckDelay(timeSpan: ...);
  // Set name of instance, default is Environment.MachineName.
  opt.SetInstanceIdentifier(identifierName: ...)
  ....

   // Configure the EF Core–backed operational store for TickerQ metadata, locks, and state. // [!code focus]
    options.AddOperationalStore<MyDbContext>(efOpt =>                     //[!code focus]
    {                                                                      //[!code focus]
        // Apply custom model configuration only during EF Core migrations                       // [!code focus]
        // (design-time). The runtime model remains unaffected.                                  // [!code focus]
        efOpt.UseModelCustomizerForMigrations();                                                // [!code focus]

        // On app start, cancel tickers left in Expired or InProgress (terminated) states        // [!code focus]
        // to prevent duplicate re-execution after crashes or abrupt shutdowns.                  // [!code focus]
        efOpt.CancelMissedTickersOnAppStart(ReleaseAcquiredTermination.CancelExpired);          // [!code focus]

        // Defined cron-based functions are auto-seeded in the database by default.                     // [!code focus]
        // Example: [TickerFunction(..., "*/5 * * * *")]                                        // [!code focus]
        // Use this to ignore them and keep seeds runtime-only.                                 // [!code focus]
        ef.IgnoreSeedMemoryCronTickers();                                           // [!code focus]                                              

        // Seed initial tickers (time-based and cron-based).                              // [!code focus]
        ef.UseTickerSeeder(                                                               // [!code focus]
            async timeTicker =>                                                           // [!code focus]
            {                                                                             // [!code focus]
                await timeTicker.AddAsync(new TimeTicker                                  // [!code focus]
                {                                                                         // [!code focus]
                    Id = Guid.NewGuid(),                                                  // [!code focus]
                    Function = "CleanupLogs",                                             // [!code focus]
                    ExecutionTime = DateTime.UtcNow.AddSeconds(5),                        // [!code focus]
                });                                                                       // [!code focus]
            },                                                                            // [!code focus]
            async cronTicker =>                                                           // [!code focus]
            {                                                                             // [!code focus]
                await cronTicker.AddAsync(new CronTicker                                  // [!code focus]
                {                                                                         // [!code focus]
                    Id = Guid.NewGuid(),                                                  // [!code focus]
                    Expression = "0 0 * * *", // every day at 00:00 UTC                   // [!code focus]
                    Function = "CleanupLogs"                                              // [!code focus]
                });                                                                       // [!code focus]
        });                                                                               // [!code focus]
    });                                                                                   // [!code focus]
});

```

## ❗️If Not Using `UseModelCustomizerForMigrations()`

### You must apply TickerQ configurations manually in your `DbContext`:

```csharp
public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply TickerQ entity configurations explicitly // [!code focus]
        // Default Schema is "ticker". // [!code focus]
        builder.ApplyConfiguration(new TimeTickerConfigurations(schema: ... ));  // [!code focus]
        builder.ApplyConfiguration(new CronTickerConfigurations(schema: ...)); // [!code focus]
        builder.ApplyConfiguration(new CronTickerOccurrenceConfigurations(schema: ...)); // [!code focus]

        // Alternatively, apply all configurations from assembly: // [!code focus]
        // builder.ApplyConfigurationsFromAssembly(typeof(TimeTickerConfigurations).Assembly); // [!code focus]
    }
}
```

> 💡 **Recommendation:**  
Use `UseModelCustomizerForMigrations()` to cleanly separate infrastructure concerns from your core domain model, especially during design-time operations like migrations.  
**Note:** If you're using third-party libraries (e.g., OpenIddict) that also override `IModelCustomizer`, you must either merge customizations or fall back to manual configuration inside `OnModelCreating()` to avoid conflicts.


## Add Migrations

Migrations would be created for `Context` that is declared at `AddOperationalStore`.

```PM
PM> add-migration "TickerQInitialCreate" -c MyDbContext
```