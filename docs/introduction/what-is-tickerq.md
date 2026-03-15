# What is TickerQ?

TickerQ is an enterprise-grade, reflection-free background task scheduler for .NET applications. Built with source generators, Entity Framework Core integration, and a real-time monitoring dashboard, TickerQ provides a production-ready solution for managing scheduled and recurring background jobs.

## Core Philosophy

TickerQ is designed around three fundamental principles:

**Performance First**: Zero runtime reflection overhead through compile-time source code generation, ensuring deterministic and efficient job execution.

**Production Ready**: Built-in persistence, distributed coordination, observability, and enterprise features required for mission-critical applications.

**Developer Experience**: Intuitive API, comprehensive documentation, and visual tools that make background job management straightforward.

## Key Capabilities

### Reflection-Free Architecture

TickerQ uses .NET source generators to generate all job discovery and execution code at compile time. This eliminates runtime reflection overhead, provides full type safety, and ensures deterministic performance characteristics suitable for high-throughput scenarios.

### Flexible Scheduling

**TimeTicker**: Schedule jobs to execute at specific dates and times. Supports one-time execution or recurring schedules with precise control over execution timing.

**CronTicker**: Schedule recurring jobs using standard 6-part cron expressions (including seconds). Automatic occurrence management tracks execution history and handles scheduling conflicts.

### Enterprise Persistence

**Entity Framework Core Integration**: Full database persistence for job state, execution history, and metadata. Supports both dedicated TickerQ databases and integration with existing application DbContext instances.

**Built-in TickerQDbContext**: Lightweight, optimized DbContext designed specifically for TickerQ. Configure connection strings directly in TickerQ options with minimal setup overhead.

### Real-Time Monitoring

**Dashboard UI**: Professional web-based interface for monitoring job execution, viewing history, managing schedules, and triggering jobs on demand. Built with Vue.js and SignalR for real-time updates.

**Observability**: OpenTelemetry integration provides distributed tracing, structured logging, and comprehensive metrics for production monitoring and debugging.

### Distributed Execution

**Multi-Node Coordination**: Redis-based coordination enables horizontal scaling across multiple application instances. Automatic node heartbeat tracking, dead node detection, and distributed locking ensure reliable job execution in clustered environments.

### Advanced Job Management

**Retry Policies**: Configurable retry mechanisms with exponential backoff, progressive delays, or custom interval patterns. Automatic retry on transient failures with configurable retry limits.

**Job Chaining**: Parent-child job relationships with conditional execution logic. Execute child jobs based on parent job outcomes (success, failure, completion).

**Priority System**: Control job execution order using priority levels (High, Normal, Low, LongRunning). Priority-based queue management ensures critical jobs execute first.

**Exception Handling**: Global exception handlers for centralized error processing, logging, and notification. Integrate with your existing monitoring and alerting infrastructure.

## Architecture

TickerQ follows a modular, extensible architecture built on a lightweight core foundation:

```
┌─────────────────────────────────────────┐
│      TickerQ (Core Library)            │
│  ┌─────────────────────────────────┐   │
│  │  Source Generator               │   │
│  │  Execution Engine               │   │
│  │  Task Scheduler                 │   │
│  │  Manager Interfaces              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
          │
          ├─── TickerQ.EntityFrameworkCore
          │    Database persistence and migrations
          │
          ├─── TickerQ.Dashboard
          │    Real-time web UI for monitoring
          │
          ├─── TickerQ.Caching.StackExchangeRedis
          │    Multi-node coordination and caching
          │
          └─── TickerQ.Instrumentation.OpenTelemetry
               Distributed tracing and observability
```

### Package Structure

- **TickerQ**: Core scheduler library. Zero dependencies, reflection-free execution engine. Required for all TickerQ deployments.

- **TickerQ.EntityFrameworkCore**: Entity Framework Core persistence provider. Enables database-backed job storage with support for migrations, querying, and historical data analysis.

- **TickerQ.Dashboard**: Production-ready web interface for job monitoring and management. Includes authentication, real-time updates via SignalR, and comprehensive job lifecycle visualization.

- **TickerQ.Caching.StackExchangeRedis**: Redis-based job persistence provider and multi-node coordination. Stores all job data directly in Redis as a lightweight alternative to EF Core, with built-in node heartbeat tracking, dead-node detection, and distributed locking for horizontal scaling.

- **TickerQ.Instrumentation.OpenTelemetry**: Observability integration for distributed tracing, structured logging, and metrics collection. Enables integration with monitoring platforms (Jaeger, Zipkin, Application Insights, etc.).

## Use Cases

TickerQ is designed for enterprise applications requiring reliable, scheduled background job execution with persistence, monitoring, and distributed coordination.

### Scheduled Tasks

- **Report Generation**: Daily, weekly, or monthly reports with data aggregation
- **Maintenance Operations**: Automated cleanup, archiving, and database optimization
- **Backup Operations**: Scheduled database and file system backups
- **Data Exports**: Periodic data export to external systems or storage

### Background Processing

- **Notification Delivery**: Email, SMS, and push notification sending with retry logic
- **File Processing**: Image resizing, document conversion, and batch file operations
- **Data Synchronization**: Sync data between systems, update caches, refresh aggregations
- **Long-Running Tasks**: Computational workloads that require background execution

### Workflow Orchestration

- **Sequential Processing**: Multi-step workflows with dependencies and conditional execution
- **Job Chaining**: Parent-child job relationships with outcome-based conditional execution
- **Batch Operations**: Process large datasets in configurable batch sizes
- **Pipeline Processing**: Complex data transformation pipelines with error handling

### Event-Driven Scheduling

- **Delayed Actions**: Execute actions after time delays (e.g., send welcome email 5 minutes after registration)
- **Timeout Handling**: Execute cleanup or cancellation logic after timeout periods
- **Scheduled Reminders**: Send reminders, notifications, or follow-ups at specific times
- **Deferred Processing**: Queue work for later execution based on business logic

## Production Considerations

TickerQ is designed for production environments with the following enterprise-grade features:

**Reliability**: Built-in persistence ensures jobs survive application restarts. Automatic retry mechanisms handle transient failures. Dead node detection prevents orphaned jobs in distributed deployments.

**Scalability**: Horizontal scaling support through Redis coordination. Configurable concurrency limits. Efficient connection pooling and database optimization for high-throughput scenarios.

**Observability**: Full OpenTelemetry integration for distributed tracing. Structured logging throughout the execution pipeline. Dashboard provides real-time visibility into job execution and system health.

**Maintainability**: Clear separation of concerns with modular architecture. Comprehensive API documentation. Migration support for version upgrades.

**Security**: Dashboard authentication options (Basic Auth, API Key, Host Authentication). Secure connection string configuration. Role-based access control integration support.

## Quick Start

Get TickerQ running in your application in minutes:

1. **Install the Core Package**
   ```bash
   dotnet add package TickerQ
   ```

2. **Register Services**
   ```csharp
   builder.Services.AddTickerQ();
   app.UseTickerQ();
   ```

3. **Create Your First Job**
   ```csharp
   [TickerFunction("MyJob")]
   public async Task MyJob(TickerFunctionContext context, CancellationToken cancellationToken)
   {
       // Your job logic
   }
   ```

4. **Schedule the Job**
   ```csharp
   await _timeTickerManager.AddAsync(new TimeTickerEntity
   {
       Function = "MyJob",
       ExecutionTime = DateTime.UtcNow.AddMinutes(5)
   });
   ```

## Next Steps

- [Installation Guide](/getting-started/installation) - Complete setup instructions
- [Quick Start Guide](/getting-started/quick-start) - Get running in 5 minutes
- [Job Types](/concepts/job-types) - Understanding TimeTicker vs CronTicker
- [Architecture Overview](/introduction/architecture) - Technical architecture details
- [Performance Benchmarks](/introduction/benchmarks) - Performance characteristics
