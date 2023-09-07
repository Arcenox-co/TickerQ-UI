# Host API

## ITickerHost Interface
Retrive the `ITickerHost` from DependencyInjection.
> ```csharp
>   private readonly ITickerHost _tickerHost;
> ``` 
>:::info Actions:
>```csharp 
>_tickerHost.NextPlannedOccurrence // get the next occurring job time. 
>_tickerHost.Run(); // runs the TickerQ if stopped.
>_tickerHost.RestartIfNeeded(newOccurrence: dateTime); // restart TickerQ if input dateTime is less than NextPlannedOccurrence.
>_tickerHost.Restart(); // restart TickerQ
>_tickerHost.Stop(); // stops the TickerQ from running.
>```
>:::tip Note
>TickerQ `Run` Method is triggered when the application starts.
>:::