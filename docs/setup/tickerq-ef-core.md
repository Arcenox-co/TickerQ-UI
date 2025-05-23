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
  // Define the DbContext to use for storing Tickers. // [!code focus]
  options.AddOperationalStore<MyDbContext>(efOpt => //[!code focus]
    { //[!code focus]
        efOpt.UseModelCustomizerForMigrations(); // Applies custom model customization only during EF Core migrations [!code focus]
        efOpt.CancelMissedTickersOnApplicationRestart(); // Useful in distributed mode [!code focus]
    }); // Enables EF-backed storage // [!code focus]
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

        // Apply TickerQ entity configurations explicitly
        builder.ApplyConfiguration(new TimeTickerConfigurations()); // [!code focus]
        builder.ApplyConfiguration(new CronTickerConfigurations()); // [!code focus]
        builder.ApplyConfiguration(new CronTickerOccurrenceConfigurations()); // [!code focus]

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