# Installation

This guide will walk you through installing and configuring TickerQ in your .NET application.

## Package Manager Console

```powershell
Install-Package TickerQ
```

## .NET CLI

::: code-group

```bash [.NET 8]
dotnet add package TickerQ --version 8.*
```

```bash [.NET 9]
dotnet add package TickerQ --version 9.*
```

```bash [.NET 10]
dotnet add package TickerQ --version 10.*
```

:::

## PackageReference

::: code-group

```xml [.NET 8]
<PackageReference Include="TickerQ" Version="8.*" />
```

```xml [.NET 9]
<PackageReference Include="TickerQ" Version="9.*" />
```

```xml [.NET 10]
<PackageReference Include="TickerQ" Version="10.*" />
```

:::

## Versioning & .NET Compatibility

TickerQ versions are aligned with the **.NET major version** you target:

- **TickerQ 8.x** → for apps targeting .NET 8
- **TickerQ 9.x** → for apps targeting .NET 9
- **TickerQ 10.x** → for apps targeting .NET 10

This applies to all companion packages as well (`TickerQ.EntityFrameworkCore`, `TickerQ.Dashboard`, Redis, OpenTelemetry, etc.): always use the same major version across all TickerQ packages in your solution.

## Prerequisites

- **.NET 8.0, 9.0, or 10.0** (use the matching TickerQ major version)
- Visual Studio 2022, Rider, or VS Code with C# extension

## Optional Packages

Add these based on your requirements:

### Entity Framework Core

For database persistence:

::: code-group

```bash [.NET 8]
dotnet add package TickerQ.EntityFrameworkCore --version 8.*
```

```bash [.NET 9]
dotnet add package TickerQ.EntityFrameworkCore --version 9.*
```

```bash [.NET 10]
dotnet add package TickerQ.EntityFrameworkCore --version 10.*
```

:::

### Dashboard

For the real-time web UI:

::: code-group

```bash [.NET 8]
dotnet add package TickerQ.Dashboard --version 8.*
```

```bash [.NET 9]
dotnet add package TickerQ.Dashboard --version 9.*
```

```bash [.NET 10]
dotnet add package TickerQ.Dashboard --version 10.*
```

:::

### Redis

For Redis-based job storage and multi-node coordination:

::: code-group

```bash [.NET 8]
dotnet add package TickerQ.Caching.StackExchangeRedis --version 8.*
```

```bash [.NET 9]
dotnet add package TickerQ.Caching.StackExchangeRedis --version 9.*
```

```bash [.NET 10]
dotnet add package TickerQ.Caching.StackExchangeRedis --version 10.*
```

:::

### OpenTelemetry

For distributed tracing:

::: code-group

```bash [.NET 8]
dotnet add package TickerQ.Instrumentation.OpenTelemetry --version 8.*
```

```bash [.NET 9]
dotnet add package TickerQ.Instrumentation.OpenTelemetry --version 9.*
```

```bash [.NET 10]
dotnet add package TickerQ.Instrumentation.OpenTelemetry --version 10.*
```

:::

## Basic Setup

### Minimal Configuration

The simplest setup requires just two lines:

```csharp
using TickerQ.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddTickerQ(); // Register services

var app = builder.Build();
app.UseTickerQ(); // Activate job processor
app.Run();
```

That's it! TickerQ is now ready to use.

### Verifying Installation

To verify TickerQ is working correctly, create a simple test job:

```csharp
public class TestJobs
{
    [TickerFunction("TestJob")]
    public async Task TestJob(
        TickerFunctionContext context,
        CancellationToken cancellationToken)
    {
        Console.WriteLine($"TickerQ is working! Job ID: {context.Id}");
    }
}

// Schedule it
await _timeTickerManager.AddAsync(new TimeTickerEntity
{
    Function = "TestJob",
    ExecutionTime = DateTime.UtcNow.AddSeconds(5)
});
```

3. **Check Application Logs**

Look for TickerQ initialization messages:
- No errors during service registration
- Background services started successfully
- Jobs executing (when scheduled)

### Configuration Options

For production use, configure options via `ConfigureScheduler`:

```csharp
builder.Services.AddTickerQ(options =>
{
    // Configure scheduler options
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.MaxConcurrency = 10; // Maximum concurrent worker threads
        scheduler.NodeIdentifier = "production-server-01"; // Unique node identifier
        scheduler.IdleWorkerTimeOut = TimeSpan.FromMinutes(1); // Idle worker timeout
        scheduler.SchedulerTimeZone = TimeZoneInfo.Utc; // Timezone for scheduling
    });
    
    // Optional: configure request serialization
    // By default, TickerQ stores request payloads as plain UTF-8 JSON bytes.
    // You can enable GZip compression to reduce storage size (at the cost of CPU).
    options.UseGZipCompression();
    
    // Set exception handler
    options.SetExceptionHandler<MyExceptionHandler>();
});
```

**See:** [Configuration Reference](/api-reference/configuration/index) for all available options.

## Advanced Configuration

### Start Mode

Control when TickerQ starts processing jobs:

```csharp
// Immediate start (default) - starts processing as soon as UseTickerQ is called
app.UseTickerQ(TickerQStartMode.Immediate);

// Manual start - requires explicit start
app.UseTickerQ(TickerQStartMode.Manual);
```

## Integrations

### Entity Framework Core

TickerQ provides a lightweight built-in `TickerQDbContext` designed specifically for TickerQ jobs. This is the recommended approach for most scenarios:

```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
using TickerQ.EntityFrameworkCore.DbContextFactory;

builder.Services.AddTickerQ(options =>
{
    options.AddOperationalStore(efOptions =>
    {
        // Use built-in TickerQDbContext with connection string
        efOptions.UseTickerQDbContext<TickerQDbContext>(optionsBuilder =>
        {
            optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=TickerQ;User Id=postgres;Password=postgres;", 
                cfg =>
                {
                    cfg.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), ["40P01"]);
                });
        });
        
        // Optional: Configure pool size
        efOptions.SetDbContextPoolSize(34);
    });
});
```

**For SQL Server:**
```csharp
efOptions.UseTickerQDbContext<TickerQDbContext>(optionsBuilder =>
{
    optionsBuilder.UseSqlServer("Server=localhost;Database=TickerQ;Integrated Security=true;");
});
```

**Alternative: Use Your Application DbContext**

If you prefer to integrate with your existing application DbContext:

```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;

builder.Services.AddTickerQ(options =>
{
    options.AddOperationalStore<MyApplicationDbContext>(efOptions =>
    {
        efOptions.UseApplicationDbContext<MyApplicationDbContext>(ConfigurationType.UseModelCustomizer);
    });
});
```

### Dashboard

```csharp
using TickerQ.DependencyInjection;
using TickerQ.Dashboard.DependencyInjection;

builder.Services.AddTickerQ(options =>
{
    options.AddDashboard(dashboardOptions =>
    {
        // Set base path (default: /tickerq/dashboard)
        dashboardOptions.SetBasePath("/tickerq/dashboard");
        
        // Configure authentication (see Dashboard Authentication)
        dashboardOptions.WithBasicAuth("admin", "password");
        // OR
        dashboardOptions.WithApiKey("your-api-key");
        // OR
        dashboardOptions.WithHostAuthentication();
    });
});
```

## Complete Setup

Here's a production-ready example with all features enabled:

```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
using TickerQ.EntityFrameworkCore.DbContextFactory;
using TickerQ.Dashboard.DependencyInjection;
using TickerQ.Caching.StackExchangeRedis.DependencyInjection;
using TickerQ.Instrumentation.OpenTelemetry.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add TickerQ with all features
builder.Services.AddTickerQ(options =>
{
    // Core scheduler configuration
    options.ConfigureScheduler(schedulerOptions =>
    {
        schedulerOptions.MaxConcurrency = 8;
        schedulerOptions.NodeIdentifier = "production-node-01";
        schedulerOptions.IdleWorkerTimeOut = TimeSpan.FromMinutes(1);
        schedulerOptions.FallbackIntervalChecker = TimeSpan.FromMinutes(1);
        schedulerOptions.SchedulerTimeZone = TimeZoneInfo.Local;
    });
    
    // Exception handling
    options.SetExceptionHandler<MyExceptionHandler>();
    
    // Entity Framework persistence (using built-in TickerQDbContext)
    options.AddOperationalStore(efOptions =>
    {
        efOptions.UseTickerQDbContext<TickerQDbContext>(optionsBuilder =>
        {
            optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=TickerQ;User Id=postgres;Password=postgres;", 
                cfg =>
                {
                    cfg.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), ["40P01"]);
                });
        });
        efOptions.SetDbContextPoolSize(34);
    });
    
    // Redis for job storage + multi-node coordination
    options.AddStackExchangeRedis(redisOptions =>
    {
        redisOptions.Configuration = "localhost:6379";
        redisOptions.NodeHeartbeatInterval = TimeSpan.FromMinutes(1);
    });
    
    // Dashboard
    options.AddDashboard(dashboardOptions =>
    {
        dashboardOptions.SetBasePath("/tickerq/dashboard");
        dashboardOptions.WithBasicAuth("admin", "secure-password");
    });
    
    // OpenTelemetry instrumentation
    options.AddOpenTelemetryInstrumentation();

    // (Optional) Explicitly load assemblies that contain [TickerFunction] jobs.
    // This is only needed in scenarios where assemblies aren't loaded automatically
    // by the host (for example, some plugin architectures or trimmed deployments).
    // All assemblies passed here must also reference the TickerQ core library so
    // the source-generated registration code is available.
    options.AddTickerQDiscovery<TimeTickerEntity, CronTickerEntity>([
        typeof(ClassLibrary1.Class1).Assembly
    ]);
});

var app = builder.Build();

// Configure middleware
app.UseTickerQ();

app.Run();
```

## Version Management

::: warning Important
All TickerQ packages are versioned together. Always update all packages to the same version.
:::

```bash
dotnet add package TickerQ --version 8.0.0
dotnet add package TickerQ.EntityFrameworkCore --version 8.0.0
dotnet add package TickerQ.Dashboard --version 8.0.0
```

## What's Next?

- [Quick Start](/getting-started/quick-start) - Get running in 5 minutes
- [Job Types](/concepts/job-types) - Learn about TimeTicker and CronTicker
- [Complete Example](/examples/complete-example) - See a full working example
