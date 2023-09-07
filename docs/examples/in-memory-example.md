# In-Memory Background Job
::: tip Note
In case of using the extension package `TickerQ.EntityFrameworkCore` you can skip this part and jump to the <a href="./in-database-example#example">In-Database Background Job</a> example.
:::

## Initial Setup
To set up a background job that runs periodically, follow these steps:
1. Create a Public Instance Class
2. Inherit from `TickerController`
3. Annotate with `TickerFunction` Attribute
    * This attribute requires two parameters: <strong>FunctionName</strong> and <strong>CronExpression</strong>.

## Example

Here's a simple example of a background job that will execute every 5 minutes. Not familiar with `Cron Expressions`? check out this <a target="_blank" href="https://crontab.cronhub.io/">Cronhub Tool</a>.
```csharp
public class MyFirstExample : TickerController
{
  [TickerFunction(FunctionName: "ExampleCronTicker", CronExpression: "*/5 * * * *")]
  public void ExampleCronTicker()
  {
    // Your background job logic goes here...
  }
}
```

## Cron Expression Mapping

::: info Map `cron expression` with the `IConfiguration` using `%`:
> Update the attribute: `TickerFunction`
>```csharp
> [TickerFunction(nameof(..., CronExpression: "%CronTicker:EveryMinute%")]
>```

>Define the cron expression to the `Appsettings.json`
>```json
>[
>  "CronTicker": {
>    "EveryMinute": "* * * * *"
>  }
>]
>```
:::
