# In-Memory Background Job
## Initial Setup
To set up a background job that runs periodically, follow these steps:

1. Create a Public Instance Class
2. Inherit from `TickerController`
3. Annotate with `TickerFunction` Attribute
    * This attribute requires a parameters: <strong>FunctionName</strong>.

## Example
Here's a simple example of a background job that will be executed `periodically` or `specified time` based on the data that are stored in the database using below steps.
```csharp
public class MyFirstExample : TickerController
{
  [TickerFunction(FunctionName: "ExampleTicker")]
  public async Task ExampleTicker(TickerFunctionContext<string> tickerContext, CancellationToken cancellationToken)
  {
    Console.WriteLine(await tickerContext.Request.Value); // output Hello
  }
}
```
## Storing jobs in database
### Store a CronTicker `(periodic job)`.

:::info Steps:
1. Retrive the `ICronTickerManager<CronTicker>` from DependencyInjection.
> ```csharp
>   private readonly ICronTickerManager<CronTicker> _cronTickerManager;
> ``` 
2. Store a `CronTicker` to the database:
> ```csharp:line-numbers
> await _cronTickerManager.AddAsync(new CronTicker
>{
>    Request = TickerHelper.CreateTickerRequest<string>("Hello"),
>    Expression = "* * * * *",
>    Function = "ExampleTicker"
>})
>```
:::

### Store a TimeTicker `(time based job)`.

:::info 
1. Retrive the `ITimeTickerManager<TimeTicker>` from DependencyInjection.
>```csharp
>  private readonly ITimeTickerManager<TimeTicker> _timeTickerManager;
>``` 
2. Store a `TimeTicker` to the database:
>```csharp:line-numbers
>await _timeTickerManager.AddAsync(new TimeTicker
>{
>    Request = TickerHelper.CreateTickerRequest<string>("Hello"),
>    ExecutionTime = DateTime.Now.AddMinutes(10),
>    Function = "ExampleTicker"
>})
>```
:::