# TickerQ SDK (Remote Nodes)

`TickerQ.SDK` lets your application register its functions with TickerQ Hub and receive execution callbacks from a Scheduler host.

## How It Works

```
Your App (SDK)                Hub                    Scheduler
     │                         │                         │
     │ 1. Register functions   │                         │
     │ ───────────────────────►│                         │
     │                         │                         │
     │ 2. Returns Scheduler URL│                         │
     │ ◄───────────────────────│                         │
     │                         │                         │
     │ 3. Schedule job ────────────────────────────────► │
     │                         │                         │
     │ 4. Execute callback ◄─────────────────────────────│
     │                         │                         │
```

1. On startup, SDK registers your `[TickerFunction]` methods with the Hub
2. Hub returns the Scheduler URL and a shared `WebhookSignature`
3. When you schedule jobs (via `ITimeTickerManager`), requests go directly to the Scheduler
4. When jobs are due, the Scheduler calls your `/execute` endpoint directly

## Installation

::: code-group

```bash [.NET CLI]
dotnet add package TickerQ.SDK
```

```powershell [Package Manager]
Install-Package TickerQ.SDK
```

```xml [PackageReference]
<PackageReference Include="TickerQ.SDK" Version="10.*" />
```

:::

## Basic Setup

```csharp
using TickerQ.DependencyInjection;
using TickerQ.SDK.DependencyInjection;
using TickerQ.Utilities.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTickerQ(options =>
{
    options.AddTickerQSdk<TimeTickerEntity, CronTickerEntity>(sdk =>
    {
        sdk.SetApiKey("YOUR_API_KEY");       // From Hub portal
        sdk.SetApiSecret("YOUR_API_SECRET"); // From Hub portal
        sdk.SetCallbackUri(new Uri("https://your-app.example.com/tickerq"));
        sdk.SetNodeName("my-app-node-1");
    });
});

var app = builder.Build();

app.UseTickerQ();

// Expose callback endpoints for the Scheduler
app.ExposeSdkExecutionEndpoint("/tickerq");

app.Run();
```

## Configuration Options

| Option | Required | Description |
|--------|----------|-------------|
| `SetApiKey()` | ✅ | API key from Hub portal |
| `SetApiSecret()` | ✅ | API secret from Hub portal |
| `SetCallbackUri()` | ✅ | Public URL where Scheduler will call your app |
| `SetNodeName()` | ✅ | Unique identifier for this node |

::: warning CallbackUri Must Be Reachable
The `CallbackUri` must be accessible from the Scheduler host. If you're running locally, use a tunnel service or ensure network connectivity.
:::

## Define Functions

Use the standard `[TickerFunction]` attribute:

```csharp
public class MyJobs
{
    private readonly ILogger<MyJobs> _logger;

    public MyJobs(ILogger<MyJobs> logger)
    {
        _logger = logger;
    }

    [TickerFunction("Report.Generate")]
    public async Task GenerateReportAsync(TickerFunctionContext context, CancellationToken ct)
    {
        _logger.LogInformation("Generating report for {FunctionName}", context.FunctionName);
        // Your job logic here
    }

    [TickerFunction("Email.SendDaily", "0 9 * * *")] // Cron: 9 AM daily
    public async Task SendDailyEmailAsync(TickerFunctionContext context, CancellationToken ct)
    {
        _logger.LogInformation("Sending daily email");
        // Your job logic here
    }
}
```

## Schedule Jobs

Use the standard managers - the SDK automatically routes requests to the Scheduler:

```csharp
public class MyService
{
    private readonly ITimeTickerManager<TimeTickerEntity> _timeManager;

    public MyService(ITimeTickerManager<TimeTickerEntity> timeManager)
    {
        _timeManager = timeManager;
    }

    public async Task ScheduleReportAsync()
    {
        // This request goes directly to the Scheduler (not Hub)
        await _timeManager.AddAsync(new TimeTickerEntity
        {
            FunctionName = "Report.Generate",
            ExecutionTime = DateTime.UtcNow.AddMinutes(30)
        });
    }
}
```

## Exposed Endpoints

When you call `app.ExposeSdkExecutionEndpoint("/tickerq")`, these endpoints are created:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/tickerq/execute` | POST | Receives job execution callbacks from Scheduler |
| `/tickerq/resync` | POST | Triggers re-registration with Hub |

Both endpoints are protected by HMAC signature validation.

## Security

### Authentication Flow

| Target | Headers |
|--------|---------|
| Hub (registration) | `X-Api-Key`, `X-Api-Secret` |
| Scheduler (job operations) | `X-TickerQ-Signature`, `X-Timestamp` |

### Signature Validation

All callbacks from the Scheduler include:
- `X-TickerQ-Signature` - HMAC-SHA256 signature
- `X-Timestamp` - Unix timestamp (must be within 5 minutes)

The SDK automatically validates these using the `WebhookSignature` received from Hub.

## Important Notes

::: info Hub URL is Fixed
The Hub URL (`https://hub.tickerq.net/`) is hardcoded in the SDK and cannot be changed.
:::

- The SDK disables local background scheduling services - all scheduling is done by the remote Scheduler
- Ensure your `CallbackUri` and `ExposeSdkExecutionEndpoint` path match
- Use the same major version as your `TickerQ` core package
