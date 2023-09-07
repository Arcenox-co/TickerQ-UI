# Change Priority
```csharp
public class MyFirstExample : TickerController
{
  [TickerFunction(..., TaskPriority: TickerTaskPriority.High)] // [!code focus]
  public async Task ExampleCronTicker(CancellationToken cancellationToken)
  {
    // Your background job logic goes here...
  }
}
```

::: info 
> Default <strong> TickerTaskPriority </strong> of the attribute is: `TickerTaskPriority.Normal`
>```csharp
> [TickerFunction(..., TaskPriority: TickerTaskPriority.Normal)]
>```
>The list of priorities
>```csharp
> public enum TickerTaskPriority
>{
>    LongRunning,
>    High,
>    Normal,
>    Low
>}
>```
::: 

