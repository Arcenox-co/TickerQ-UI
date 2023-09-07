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

services.AddTicker(opt =>
{
  ....
  // Define the DbContext to use for storing Tickers. // [!code focus]
  opt.AddOperationalStore<MyDbContext>(); // [!code focus]
  // Set fallback time out to check for missed jobs and execute. // [!code focus]
  opt.SetTimeOutJobChecker(timeSpan: ...); // [!code focus]
  // Set name of instance, default is Environment.MachineName. // [!code focus]
  opt.SetInstanceIdentifier(identifierName: ...) // [!code focus]
});

```

## Add Migrations

Migrations would be created for `Context` that is declared at `AddOperationalStore`.

```PM
PM> add-migration "InitialCreate" -c MyDbContext
```