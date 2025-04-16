# TickerQ
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


## Configure Services
Register TickerQ in <code>IServiceCollection</code>
```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
....

services.AddTickerQ(opt =>
{
  // Set your class that implements ITickerExceptionHandler.  
  opt.SetExceptionHandler<MyExceptionHandlerClass>();
  // Set the max thread concurrency for Ticker (default: Environment.ProcessorCount).
  opt.SetMaxConcurrency(maxConcurrency: ...);
});

```

## Configure Middleware
Use TickerQ using <code>IApplicationBuilder</code>

```csharp
using TickerQ.DependencyInjection;
....

// (default: TickerQStartMode.Immediate)
app.UseTickerQ(startMode: ...);
```