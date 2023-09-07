# Adjust Stored Request Data

<div class="danger custom-block" style="padding-top:8px;">
    <p>This feature is available exclusively through the extension package: TickerQ.EntityFrameworkCore.</p>
</div>

## Adjust `Store/Retrieve` data
* Current:
>When we stored the request we used the helper: <a href="/examples/in-database-example.html#storing-jobs-in-database">Storing jobs in database</a> `code-line 3`:
>```csharp
>Request = TickerHelper.CreateTickerRequest<string>("Hello") // [!code focus]
>```
><div class="tip custom-block" style="padding-top:8px;">
><code>CreateTickerRequest</code> compresses the data into <code>GZip</code> and stores in database as <code>ByteArray</code>.
></div>

* Update:
>Once you decide against using `TickerHelper` for data storage and opt to create your own mechanism, you must also override the data retrieval method.
>```csharp
>Request = //your code // [!code focus]
>```
>:::info Override the retrieving request.
>Override the method `GetRequestValueAsync` of `TickerController` in your class: 
>```csharp
>public class MyFirstExample : TickerController
>{
>   [TickerFunction(FunctionName: "ExampleTicker")]
>   public async Task ExampleTicker(TickerFunctionContext<string> tickerContext, CancellationToken cancellationToken)
>   {
>      await tickerContext.Request.Value; // Outputs GetRequestValueAsync...
>   }
>
>   public override Task<T> GetRequestValueAsync<T>(Guid tickerId, TickerType tickerType)
>   { 
>      // retrieve stored request data code... 
>   }  
>}
>```
>:::