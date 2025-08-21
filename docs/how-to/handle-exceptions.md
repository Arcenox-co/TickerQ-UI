# Handle Exceptions

## Create your own `Exception Handler`

1. Create a Public Instance Class
2. Implement the interface `ITickerExceptionHandler`


```csharp
public class TickerExceptionHandler : ITickerExceptionHandler
{
    public async Task HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
    {
      // your logic...
    }

    public async Task HandleCanceledExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
    {
      // your logic...
    }
}
```

:::info Register your `Exception Handler`
* After creating and implementing your `ExceptionHandler` class you should add it at `TickerQ` Config.
```csharp
....
services.AddTicker(opt =>
{
  opt.SetExceptionHandler<TickerExceptionHandler>(); // [!code focus]
});
```
:::