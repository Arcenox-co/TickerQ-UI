# TickerQ Remote Executor (Scheduler Host)

`TickerQ.RemoteExecutor` turns your application into a **centralized scheduler** that stores jobs, manages scheduling, and executes them by calling back to SDK nodes.

## How It Works

```
SDK Apps                       Hub                    Your App (Scheduler)
    │                           │                              │
    │ Register functions ──────►│                              │
    │                           │                              │
    │                           │◄──── Sync functions ─────────│
    │                           │      (get callback URLs)     │
    │                           │                              │
    │ Schedule job ────────────────────────────────────────────►│
    │                           │                    (stores job)│
    │                           │                              │
    │◄──────────────────────────────── Execute callback ───────│
    │                           │           (when job is due)  │
```

1. SDK apps register their functions with Hub
2. Your Scheduler syncs function metadata from Hub (including SDK callback URLs)
3. SDK apps send job requests directly to your Scheduler
4. When jobs are due, your Scheduler calls SDK apps directly via their callback URLs

## Installation

::: code-group

```bash [.NET CLI]
dotnet add package TickerQ.RemoteExecutor
```

```powershell [Package Manager]
Install-Package TickerQ.RemoteExecutor
```

```xml [PackageReference]
<PackageReference Include="TickerQ.RemoteExecutor" Version="10.*" />
```

:::

## Basic Setup

```csharp
using TickerQ.DependencyInjection;
using TickerQ.RemoteExecutor;
using TickerQ.Utilities.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTickerQ(options =>
{
    // Add persistence (required for job storage)
    options.AddOperationalStore(efOptions =>
    {
        efOptions.UseTickerQDbContext<TickerQDbContext>(dbOptions =>
        {
            dbOptions.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
        });
    });

    // Add remote executor
    options.AddTickerRemoteExecutor<TimeTickerEntity, CronTickerEntity>(remote =>
    {
        remote.SetApiKey("YOUR_API_KEY");       // From Hub portal
        remote.SetApiSecret("YOUR_API_SECRET"); // From Hub portal
    });
});

var app = builder.Build();

app.UseTickerQ();

// Expose endpoints for SDK job operations and Hub webhooks
app.MapTickerQRemoteExecutionEndpoints("/tickerq");

app.Run();
```

## Configuration Options

| Option | Required | Description |
|--------|----------|-------------|
| `SetApiKey()` | ✅ | API key from Hub portal |
| `SetApiSecret()` | ✅ | API secret from Hub portal |

::: info Hub URL is Fixed
The Hub URL (`https://hub.tickerq.net/`) is hardcoded and cannot be changed.
:::

## What It Provides

### On Startup
- Syncs all registered nodes and functions from Hub
- Receives the `WebhookSignature` for validating SDK requests
- Registers functions locally so the scheduler can execute them

### At Runtime
- Stores and schedules jobs in your database
- Executes jobs by calling SDK callback URLs with HMAC-signed requests
- Processes Hub webhooks for function updates

## Exposed Endpoints

When you call `app.MapTickerQRemoteExecutionEndpoints("/tickerq")`, these endpoints are created:

### Hub Webhooks

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/tickerq/webhooks/hub` | POST | Triggers function re-sync from Hub |
| `/tickerq/webhooks/hub/remove-function` | POST | Removes a specific function |

### Function Registration

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/tickerq/functions/register` | POST | Register functions directly (alternative to Hub sync) |

### Time Ticker Operations (from SDK)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/tickerq/time-tickers` | POST | Create time-based jobs |
| `/tickerq/time-tickers` | PUT | Update time-based jobs |
| `/tickerq/time-tickers/delete` | POST | Delete time-based jobs |
| `/tickerq/time-tickers/context` | PUT | Update job execution context |
| `/tickerq/time-tickers/request/{id}` | GET | Get job request payload |

### Cron Ticker Operations (from SDK)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/tickerq/cron-tickers` | POST | Create cron jobs |
| `/tickerq/cron-tickers` | PUT | Update cron jobs |
| `/tickerq/cron-tickers/delete` | POST | Delete cron jobs |
| `/tickerq/cron-ticker-occurrences/context` | PUT | Update occurrence context |
| `/tickerq/cron-ticker-occurrences/request/{id}` | GET | Get occurrence request payload |

All endpoints are protected by HMAC signature validation.

## Security

### Incoming Requests (from SDK)

SDK requests include:
- `X-TickerQ-Signature` - HMAC-SHA256 signature
- `X-Timestamp` - Unix timestamp (must be within 5 minutes)

The Scheduler validates these using the `WebhookSignature` received from Hub.

### Outgoing Requests (to SDK)

When executing jobs, the Scheduler signs callbacks with:
- `X-TickerQ-Signature` - HMAC-SHA256 signature
- `X-Timestamp` - Unix timestamp

## Persistence Required

The RemoteExecutor needs a persistence layer to store jobs. Configure Entity Framework:

```csharp
options.AddOperationalStore(efOptions =>
{
    efOptions.UseTickerQDbContext<TickerQDbContext>(dbOptions =>
    {
        dbOptions.UseSqlServer(connectionString);
        // Or: dbOptions.UseNpgsql(connectionString);
        // Or: dbOptions.UseSqlite(connectionString);
    });
});
```

See [Entity Framework Setup](/features/entity-framework/) for details.

## Important Notes

- The Scheduler must be reachable by SDK apps for job operations
- Background scheduling services remain **enabled** (unlike SDK which disables them)
- All registered functions are stored in memory and refreshed on sync
- Use the same major version as your `TickerQ` core package
