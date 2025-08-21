# In-Memory Mode

The in-memory mode of **TickerQ** allows you to schedule background jobs without needing a database or any external dependencies. It’s ideal for lightweight services, cron-driven execution, and one-node deployments.


## Initial Setup

To configure a periodic job using TickerQ:

1. **Create a Public or Internal Class**  
   Your class should have either a parameterless or DI-supported constructor.

2. **Annotate the Method with `[TickerFunction]`**  
   This attribute takes two required parameters:
   - `FunctionName` — a unique identifier for the job
   - `CronExpression` — a standard cron string (e.g., `"*/5 * * * *"`)


## Example

This example defines a job that runs every 5 minutes:

```csharp
public class MyBackgroundService
{
    private readonly IUserService _userService;

    public MyBackgroundService(IUserService userService)
    {
        _userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

    [TickerFunction(FunctionName: "ExampleMethod", CronExpression: "*/5 * * * *")]
    public void ExampleMethod()
    {
        // Your background job logic goes here...
        _userService.DoSomething();
    }

    [TickerFunction(FunctionName: "DeactivateStaleUsers", CronExpression: "0 0 * * 0")]
    public void DeactivateStaleUsersAsync()
    {
        // Deactivate accounts that haven't been used for a set period.
    }

    [TickerFunction(FunctionName: "CleanUpUserSessions", CronExpression: "0 */2 * * *")]
    public void CleanUpUserSessions()
    {
        // Remove expired or inactive user sessions.
    }
}
```


## Cron Expression via Configuration

You can also reference cron expressions from `appsettings.json` using `%Section:Key%` syntax:

```csharp
[TickerFunction(FunctionName: "ExampleMethod", CronExpression: "%CronTicker:EveryMinute%")]
public void ExampleMethod() { }
```

```json
{
  "CronTicker": {
    "EveryMinute": "* * * * *"
  }
}
```


## Good to Know

- ✅ Supports DI — inject any service into your job class.
- ✅ No reflection — method dispatch is handled via a Roslyn source generator.
- ✅ Simple and fast — no database or configuration needed.


## Limitations

In-memory mode **does not** support:
- Job persistence or retry tracking
- Multi-node execution

For advanced scenarios, consider upgrading to [EF Core Mode](/examples/in-database-example).