# Getting Started
## Installation
>You can install it with:
>::: code-group
>```cli [.NET CLI]
>> dotnet add package TickerQ
>```
>```pm [Package Manager]
>PM> NuGet\Install-Package TickerQ
>```
>```pm [Package Reference]
><PackageReference Include="TickerQ" Version="*" />
>```
>:::

:::tip Note
TickerQ by default does not support time-based jobs and is not intended for use with load balancers. If you require these features, you can extend by adding TickerQ.EntityFrameworkCore package, which provides support for storing jobs in a database and is suitable for use with load balancers. Check it out on the `Next Page`.
:::

## Configure Services
Register TickerQ in <code>IServiceCollection</code>
```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
....

services.AddTicker(opt =>
{
  // Add other assemblies containing Ticker classes, if applicable.
  opt.SetAssemblies(assemblies: ...);
  // Set your class that implements ITickerExceptionHandler.  
  opt.SetExceptionHandler<MyExceptionHandlerClass>(); 
  // Set the TimeZoneInfo for Ticker (default is TimeZoneInfo.Local).
  opt.SetClockTimeZone(timeZoneInfo: ...); 
  // Set the max thread concurrency for Ticker (default is Environment.ProcessorCount).
  opt.SetMaxConcurrency(maxConcurrency: ...); 
});

```

## Configure Middleware
Use TickerQ using <code>IApplicationBuilder</code>

```csharp
using TickerQ.DependencyInjection;
...

app.UseTicker();
```