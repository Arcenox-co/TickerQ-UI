# Database Cleanup

Patterns for periodic cleanup and maintenance jobs.

## Periodic Cleanup Job

Clean up old records daily at 2 AM:

```csharp
public class CleanupJobs
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<CleanupJobs> _logger;

    public CleanupJobs(AppDbContext dbContext, ILogger<CleanupJobs> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [TickerFunction("CleanupOldRecords", cronExpression: "0 0 2 * * *")]
    public async Task CleanupOldRecords(
        TickerFunctionContext context,
        CancellationToken cancellationToken)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-90);

        var oldLogs = await _dbContext.Logs
            .Where(l => l.CreatedAt < cutoffDate)
            .ToListAsync();

        _dbContext.Logs.RemoveRange(oldLogs);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Cleaned up {Count} old log records", oldLogs.Count);
    }
}
```

## Archive Before Delete

Archive records before deleting them:

```csharp
[TickerFunction("ArchiveAndCleanup")]
public async Task ArchiveAndCleanup(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var cutoffDate = DateTime.UtcNow.AddDays(-365);
    var oldRecords = await _dbContext.Orders
        .Where(o => o.CreatedAt < cutoffDate && !o.Archived)
        .ToListAsync();

    foreach (var record in oldRecords)
    {
        await _archiveService.ArchiveAsync(record, cancellationToken);
        record.Archived = true;
    }

    await _dbContext.SaveChangesAsync(cancellationToken);

    var veryOldRecords = await _dbContext.Orders
        .Where(o => o.CreatedAt < DateTime.UtcNow.AddYears(-2) && o.Archived)
        .ToListAsync();

    _dbContext.Orders.RemoveRange(veryOldRecords);
    await _dbContext.SaveChangesAsync(cancellationToken);
}
```

## Incremental Cleanup

Process cleanup in batches to avoid long-running transactions:

```csharp
[TickerFunction("IncrementalCleanup", cronExpression: "0 */30 * * * *")]
public async Task IncrementalCleanup(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var batchSize = 1000;
    var cutoffDate = DateTime.UtcNow.AddDays(-90);

    while (true)
    {
        var batch = await _dbContext.TempRecords
            .Where(r => r.CreatedAt < cutoffDate)
            .Take(batchSize)
            .ToListAsync(cancellationToken);

        if (!batch.Any())
            break;

        _dbContext.TempRecords.RemoveRange(batch);
        await _dbContext.SaveChangesAsync(cancellationToken);

        cancellationToken.ThrowIfCancellationRequested();
    }
}
```

## See Also

- [Scheduled Maintenance](./scheduled-maintenance) - Database optimization
- [Batch Processing](./batch-processing) - Processing large datasets
- [Error Handling](../../concepts/error-handling) - Handling cleanup failures

