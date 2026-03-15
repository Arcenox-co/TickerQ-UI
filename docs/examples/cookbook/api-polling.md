# API Polling

Patterns for polling external APIs with TickerQ.

## Poll External API Periodically

Poll an external API every 5 minutes:

```csharp
public class ApiPollingJobs
{
    private readonly IExternalApiClient _apiClient;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<ApiPollingJobs> _logger;

    public ApiPollingJobs(
        IExternalApiClient apiClient,
        AppDbContext dbContext,
        ILogger<ApiPollingJobs> logger)
    {
        _apiClient = apiClient;
        _dbContext = dbContext;
        _logger = logger;
    }

    [TickerFunction("PollExternalApi", cronExpression: "0 */5 * * * *")]
    public async Task PollExternalApi(
        TickerFunctionContext context,
        CancellationToken cancellationToken)
    {
        try
        {
            var data = await _apiClient.FetchDataAsync(cancellationToken);

            foreach (var item in data)
            {
                var existing = await _dbContext.DataItems
                    .FirstOrDefaultAsync(d => d.ExternalId == item.Id, cancellationToken);

                if (existing == null)
                {
                    _dbContext.DataItems.Add(new DataItem { /* ... */ });
                }
                else
                {
                    existing.Value = item.Value;
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
        {
            _logger.LogWarning("Rate limited, will retry on next occurrence");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to poll external API");
            throw;
        }
    }
}
```

## Poll with Backoff on Failure

Implement exponential backoff based on retry count:

```csharp
[TickerFunction("PollWithBackoff")]
public async Task PollWithBackoff(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var retryCount = context.RetryCount;
    var delaySeconds = (int)Math.Pow(2, retryCount); // 1s, 2s, 4s, 8s...

    if (retryCount > 0)
    {
        _logger.LogInformation("Retrying after {Delay}s (attempt {Attempt})",
            delaySeconds, retryCount + 1);
        await Task.Delay(TimeSpan.FromSeconds(delaySeconds), cancellationToken);
    }

    try
    {
        var data = await _apiClient.FetchDataAsync(cancellationToken);
        await ProcessDataAsync(data, cancellationToken);
    }
    catch (Exception ex) when (retryCount < 5)
    {
        _logger.LogWarning(ex, "API call failed, will retry");
        throw;
    }
}
```

## Poll Multiple Endpoints

Poll multiple APIs in sequence:

```csharp
[TickerFunction("PollMultipleApis", cronExpression: "0 */10 * * * *")]
public async Task PollMultipleApis(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var endpoints = new[] { "api1", "api2", "api3" };
    
    foreach (var endpoint in endpoints)
    {
        try
        {
            await PollEndpointAsync(endpoint, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to poll {Endpoint}", endpoint);
            // Continue with next endpoint instead of failing entire job
        }
    }
}

private async Task PollEndpointAsync(string endpoint, CancellationToken cancellationToken)
{
    // Poll logic here
}
```

## See Also

- [Retry Strategies](./retry-strategies) - Different retry approaches
- [Error Handling](../../concepts/error-handling) - Handling API failures
- [Workflow Orchestration](./workflow-orchestration) - Chaining API calls

