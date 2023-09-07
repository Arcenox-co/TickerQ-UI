# To Async

## Async Task Method

```csharp
public class MyFirstExample : TickerController
{
  [TickerFunction(...)]
  public async Task ExampleTicker(CancellationToken cancellationToken) // [!code focus]
  {
    // Your background job logic goes here...
  }
}
```
## Async ValueTask Method
```csharp
public class MyFirstExample : TickerController
{
  [TickerFunction(...)]
  public async ValueTask ExampleTicker(CancellationToken cancellationToken) // [!code focus]
  {
    // Your background job logic goes here...
  }
}
```