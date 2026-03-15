# Data Synchronization

Sync data between systems and databases.

## Sync Between Systems

Sync data from source to target every 30 minutes:

```csharp
public class SyncJobs
{
    private readonly SourceDbContext _sourceDb;
    private readonly TargetDbContext _targetDb;
    private readonly ILogger<SyncJobs> _logger;

    public SyncJobs(
        SourceDbContext sourceDb,
        TargetDbContext targetDb,
        ILogger<SyncJobs> logger)
    {
        _sourceDb = sourceDb;
        _targetDb = targetDb;
        _logger = logger;
    }

    [TickerFunction("SyncData", cronExpression: "0 */30 * * * *")]
    public async Task SyncData(
        TickerFunctionContext context,
        CancellationToken cancellationToken)
    {
        var since = DateTime.UtcNow.AddMinutes(-30);
        var itemsToSync = await _sourceDb.Items
            .Where(i => i.UpdatedAt >= since)
            .ToListAsync(cancellationToken);

        foreach (var item in itemsToSync)
        {
            var existing = await _targetDb.Items
                .FirstOrDefaultAsync(i => i.SourceId == item.Id, cancellationToken);

            if (existing == null)
            {
                _targetDb.Items.Add(MapItem(item));
            }
            else
            {
                UpdateItem(existing, item);
            }
        }

        await _targetDb.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Synced {Count} items", itemsToSync.Count);
    }
}
```

## Incremental Sync

Sync only changed records using version/timestamp:

```csharp
[TickerFunction("IncrementalSync", cronExpression: "0 */10 * * * *")]
public async Task IncrementalSync(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var lastSync = await GetLastSyncTimestampAsync(_targetDb, cancellationToken);

    var changedItems = await _sourceDb.Items
        .Where(i => i.UpdatedAt > lastSync)
        .ToListAsync(cancellationToken);

    foreach (var item in changedItems)
    {
        await SyncItemAsync(item, _targetDb, cancellationToken);
    }

    await UpdateLastSyncTimestampAsync(_targetDb, DateTime.UtcNow, cancellationToken);
}
```

## Bidirectional Sync

Sync data in both directions:

```csharp
[TickerFunction("BidirectionalSync", cronExpression: "0 */15 * * * *")]
public async Task BidirectionalSync(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Sync A -> B
    await SyncAsync(sourceA, targetB, cancellationToken);
    
    // Sync B -> A
    await SyncAsync(sourceB, targetA, cancellationToken);
}
```

## Conflict Resolution

Handle sync conflicts:

```csharp
[TickerFunction("SyncWithConflictResolution")]
public async Task SyncWithConflictResolution(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var items = await GetItemsToSyncAsync(cancellationToken);
    
    foreach (var item in items)
    {
        var existing = await GetExistingItemAsync(item, cancellationToken);
        
        if (existing != null)
        {
            // Conflict detected - use latest wins strategy
            if (item.UpdatedAt > existing.UpdatedAt)
            {
                await UpdateItemAsync(existing, item, cancellationToken);
            }
            else
            {
                _logger.LogInformation("Existing item is newer, skipping");
            }
        }
        else
        {
            await CreateItemAsync(item, cancellationToken);
        }
    }
}
```

## See Also

- [API Polling](./api-polling) - Polling external APIs
- [Database Cleanup](./database-cleanup) - Maintaining sync quality
- [Error Handling](../../concepts/error-handling) - Handling sync failures

