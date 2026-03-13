# OpenTelemetry Integration

TickerQ.Instrumentation.OpenTelemetry provides distributed tracing and structured logging for TickerQ jobs via the OpenTelemetry `ActivitySource` API. It focuses solely on emitting TickerQ-specific telemetry; exporters, sampling, and backends are configured in your application's OpenTelemetry pipeline.

## Quick Start

```shell
dotnet package add TickerQ.Instrumentation.OpenTelemetry
```

```csharp
using TickerQ.DependencyInjection;
using TickerQ.Instrumentation.OpenTelemetry;
using OpenTelemetry.Trace;

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddSource("TickerQ")
               .AddConsoleExporter()
               .AddJaegerExporter();
    });

// Add TickerQ with OpenTelemetry instrumentation
builder.Services.AddTickerQ(options =>
{
    // Your TickerQ configuration
    options.AddOpenTelemetryInstrumentation(); // 👈 Enable tracing
});

var app = builder.Build();
app.UseTickerQ();
app.Run();
```

## Trace Structure

### Activity Hierarchy

TickerQ creates activities at different stages of job lifecycle:

```
Job Lifecycle:
tickerq.job.enqueued              (when job is added to queue)
tickerq.job.execute.timeticker    (main TimeTicker execution span)
  └── One of the following outcomes:
      ├── tickerq.job.completed   (on completion)
      ├── tickerq.job.failed      (on failure)
      ├── tickerq.job.cancelled   (on cancellation)
      └── tickerq.job.skipped     (when skipped)

CronTicker Lifecycle:
tickerq.job.execute.crontickeroccurrence (CronTicker occurrence execution)
  └── Same outcomes as above

Seeding Lifecycle:
tickerq.seeding.started           (when seeding begins)
tickerq.seeding.completed         (when seeding completes)

Error Events:
tickerq.job_request_serialization.failed (request deserialization failure)
```

### Activity Names

| Activity Name | Description |
|---------------|-------------|
| `tickerq.job.execute.timeticker` | Main TimeTicker execution span |
| `tickerq.job.execute.crontickeroccurrence` | CronTicker occurrence execution span |
| `tickerq.job.enqueued` | Job enqueued event |
| `tickerq.job.completed` | Job completed event |
| `tickerq.job.failed` | Job failed event |
| `tickerq.job.cancelled` | Job cancelled event |
| `tickerq.job.skipped` | Job skipped event |
| `tickerq.job_request_serialization.failed` | Request deserialization failure |
| `tickerq.seeding.started` | Data seeding started |
| `tickerq.seeding.completed` | Data seeding completed |

## Activity Tags

TickerQ adds comprehensive tags to activities:

### Job Execution Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.job.id` | Unique job identifier | `123e4567-e89b-12d3-a456-426614174000` |
| `tickerq.job.type` | Type of ticker | `TimeTicker`, `CronTicker` |
| `tickerq.job.function` | Function name | `ProcessEmails` |
| `tickerq.job.priority` | Job priority | `Normal`, `High`, `LongRunning` |
| `tickerq.job.machine` | Machine executing job | `web-server-01` |
| `tickerq.job.retries` | Maximum retry attempts | `3` |
| `tickerq.job.parent_id` | Parent job ID (if child job) | `parent-job-guid` |
| `tickerq.job.run_condition` | Run condition for child jobs | `OnSuccess`, `OnFailure`, `Always` |

### Job Enqueued Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.job.enqueued_from` | Where job was enqueued | `UserController.CreateUser (Program.cs:42)` |

### Job Completed Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.job.execution_time_ms` | Execution time in milliseconds | `1250` |
| `tickerq.job.success` | Whether execution was successful | `true`, `false` |

### Job Failed Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.job.retry_count` | Current retry attempt | `1`, `2`, `3` |
| `tickerq.job.error_type` | Exception type | `SqlException`, `TimeoutException` |
| `tickerq.job.error_message` | Error message | `Connection timeout` |
| `tickerq.job.error_stack_trace` | Full stack trace | `at MyService.ProcessData()...` |

### Job Cancelled Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.job.cancellation_reason` | Reason for cancellation | `Task was cancelled` |

### Job Skipped Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.job.skip_reason` | Reason for skipping | `Another instance is already running` |

### Seeding Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `tickerq.seeding.type` | Type of ticker being seeded | `TimeTicker`, `CronTicker` |
| `tickerq.seeding.environment` | Node identifier | `production-node-01` |

## Integration Examples

### With Jaeger

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddSource("TickerQ")
               .AddJaegerExporter(options =>
               {
                   options.Endpoint = new Uri("http://localhost:14268/api/traces");
               });
    });

builder.Services.AddTickerQ(options =>
{
    options.AddOpenTelemetryInstrumentation();
});
```

### With Azure Application Insights

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddSource("TickerQ")
               .AddAzureMonitorTraceExporter(options =>
               {
                   options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
               });
    });

builder.Services.AddTickerQ(options =>
{
    options.AddOpenTelemetryInstrumentation();
});
```

### With Zipkin

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddSource("TickerQ")
               .AddZipkinExporter(options =>
               {
                   options.Endpoint = new Uri("http://localhost:9411/api/v2/spans");
               });
    });

builder.Services.AddTickerQ(options =>
{
    options.AddOpenTelemetryInstrumentation();
});
```

### With OTLP (OpenTelemetry Protocol)

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddSource("TickerQ")
               .AddOtlpExporter(options =>
               {
                   options.Endpoint = new Uri("http://localhost:4317");
               });
    });

builder.Services.AddTickerQ(options =>
{
    options.AddOpenTelemetryInstrumentation();
});
```

## Structured Logging

TickerQ provides structured logging through `ILogger` with consistent message templates:

### Log Output Examples

```
[INF] TickerQ Job enqueued: TimeTicker - ProcessEmails (123e4567-e89b-12d3-a456-426614174000) from UserController.CreateUser (Program.cs:42)
[INF] TickerQ Job started: TimeTicker - ProcessEmails (123e4567-e89b-12d3-a456-426614174000)
[INF] TickerQ Job completed: ProcessEmails (123e4567-e89b-12d3-a456-426614174000) in 1250ms - Success: True
[ERR] TickerQ Job failed: ProcessEmails (123e4567-e89b-12d3-a456-426614174000) - Retry 1 - Connection timeout
[WRN] TickerQ Job cancelled: ProcessEmails (123e4567-e89b-12d3-a456-426614174000) - Task was cancelled
[INF] TickerQ Job skipped: ProcessEmails (123e4567-e89b-12d3-a456-426614174000) - Another CronOccurrence is already running!
[INF] TickerQ start seeding data: TimeTicker (production-node-01)
[INF] TickerQ completed seeding data: TimeTicker (production-node-01)
[ERR] Failed to deserialize request to OrderRequest - 123e4567-e89b-12d3-a456-426614174000 - TimeTicker: JsonException...
```

### Log Message Templates

| Event | Level | Template |
|-------|-------|----------|
| Job Enqueued | Information | `TickerQ Job enqueued: {JobType} - {Function} ({JobId}) from {EnqueuedFrom}` |
| Job Started | Information | `TickerQ Job started: {JobType} - {Function} ({JobId})` |
| Job Completed | Information | `TickerQ Job completed: {Function} ({JobId}) in {ExecutionTime}ms - Success: {Success}` |
| Job Failed | Error | `TickerQ Job failed: {Function} ({JobId}) - Retry {RetryCount} - {Error}` |
| Job Cancelled | Warning | `TickerQ Job cancelled: {Function} ({JobId}) - {Reason}` |
| Job Skipped | Information | `TickerQ Job skipped: {Function} ({JobId}) - {Reason}` |
| Seeding Started | Information | `TickerQ start seeding data: {TickerType} ({EnvironmentName})` |
| Seeding Completed | Information | `TickerQ completed seeding data: {TickerType} ({EnvironmentName})` |
| Deserialization Failed | Error | `Failed to deserialize request to {RequestType} - {TickerId} - {TickerType}: {Exception}` |

### Logging Frameworks

Works with any logging framework that integrates with `ILogger`:

#### Serilog

```csharp
builder.Host.UseSerilog((context, config) =>
{
    config.WriteTo.Console()
          .WriteTo.File("logs/tickerq-.txt", rollingInterval: RollingInterval.Day)
          .Enrich.FromLogContext();
});
```

#### NLog

```csharp
builder.Logging.ClearProviders();
builder.Logging.AddNLog();
```

#### Application Insights

```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

## Parent-Child Relationships

TickerQ maintains trace relationships between parent and child jobs:

```
tickerq.job.execute.timeticker (parent)
└── tickerq.job.execute.timeticker (child)
    └── tickerq.job.execute.timeticker (grandchild)
```

Child job traces are linked to parent traces using the `tickerq.job.parent_id` tag.

## Performance Considerations

### Minimal Overhead

- Activities are only created when OpenTelemetry listeners are active
- Uses structured logging with minimal string allocations
- No performance impact when tracing is disabled

### Conditional Tracing

Tracer automatically handles cases where no listeners are registered:

```csharp
// No overhead if no listeners
using var activity = _instrumentation.StartJobActivity("my-job", context);
// Activity will be null if no listeners
```

## Filtering and Sampling

Configure sampling for TickerQ traces:

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddSource("TickerQ")
               .SetSampler(new TraceIdRatioBasedSampler(0.1)) // Sample 10% of traces
               .AddJaegerExporter();
    });
```

Or filter specific jobs:

```csharp
tracing.AddSource("TickerQ")
       .AddProcessor(new SimpleActivityExportProcessor(new CustomExporter()))
       .AddJaegerExporter();
```

## Best Practices

### 1. Correlation with Application Traces

Ensure TickerQ traces are correlated with your application traces:

```csharp
// In your job function
using var activity = Activity.Current; // Get current activity
if (activity != null)
{
    activity.SetTag("custom.tag", "value");
}
```

### 2. Filter High-Volume Jobs

Consider sampling or filtering for high-frequency jobs:

```csharp
// Sample only 1% of high-frequency jobs
tracing.SetSampler(new TraceIdRatioBasedSampler(0.01));
```

### 3. Use Structured Logging

Leverage structured logging for better querying:

```csharp
_logger.LogInformation(
    "Job {JobId} completed in {ElapsedMs}ms with status {Status}",
    jobId, elapsedMs, status);
```

### 4. Monitor Trace Volume

Monitor trace volume in your observability platform to avoid overwhelming your tracing backend.

## Requirements

- .NET 8.0 or later
- OpenTelemetry 1.7.0 or later
- TickerQ.Utilities (automatically included)

## Next Steps

- [Learn About Dashboard](/features/dashboard)
- [Configure Entity Framework](/features/entity-framework)
- [Explore Redis Integration](/features/redis)
