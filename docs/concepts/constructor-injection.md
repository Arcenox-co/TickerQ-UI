# Constructor Injection & TickerQConstructor

TickerQ's source generator wires up your job classes and their constructors so dependencies can be injected when `[TickerFunction]` methods run.

When a class has **multiple constructors**, you can control which one TickerQ uses with the `[TickerQConstructor]` attribute.

## Default Behavior (Single or Multiple Constructors)

- If a class with `[TickerFunction]` methods has **one** constructor (or a primary constructor), that constructor is used.
- If a class has **multiple** constructors and **none** is marked with `[TickerQConstructor]`:
  - The generator emits a **warning** (`MultipleConstructors`).
  - The **first** constructor (including a primary constructor, if present) is used for DI.

Example (single constructor – no attribute needed):

```csharp
public class EmailJobs(ILogger<EmailJobs> logger)
{
    private readonly ILogger<EmailJobs> _logger = logger;

    [TickerFunction("SendWelcomeEmail")]
    public async Task SendWelcomeEmail(
        TickerFunctionContext<WelcomeEmailRequest> context,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Sending welcome email to {Email}", context.Request.Email);
        // ...
    }
}
```

## Using [TickerQConstructor]

When your class has multiple constructors, use `[TickerQConstructor]` to mark the one TickerQ should use for dependency injection.

```csharp
using TickerQ.Utilities.Base;

public class ReportJobs
{
    private readonly IReportService _reportService;
    private readonly ILogger<ReportJobs> _logger;

    public ReportJobs(IReportService reportService)
    {
        _reportService = reportService;
    }

    [TickerQConstructor] // Preferred constructor for TickerQ
    public ReportJobs(
        IReportService reportService,
        ILogger<ReportJobs> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [TickerFunction("GenerateDailyReport")]
    public async Task GenerateDailyReport(
        TickerFunctionContext<ReportRequest> context,
        CancellationToken cancellationToken)
    {
        await _reportService.GenerateAsync(context.Request, cancellationToken);
        _logger?.LogInformation("Generated report {ReportId}", context.Request.ReportId);
    }
}
```

Rules enforced by the source generator:

- If **exactly one** constructor has `[TickerQConstructor]`, that constructor is used.
- If **multiple** constructors have `[TickerQConstructor]`, the generator emits an **error** (`MultipleTickerQConstructorAttributes`), and you must fix it.
- If **no** constructor has `[TickerQConstructor]` but multiple constructors exist, the generator issues a **warning** and falls back to the first constructor.

## Primary Constructors

C# primary constructors on the class declaration are also considered:

```csharp
public class BillingJobs(IBillingService billingService)
{
    [TickerFunction("ChargeCustomer")]
    public async Task ChargeCustomer(
        TickerFunctionContext<ChargeRequest> context,
        CancellationToken cancellationToken)
    {
        await billingService.ChargeAsync(context.Request, cancellationToken);
    }
}
```

If you add additional constructors, you should mark one of them with `[TickerQConstructor]` to avoid warnings and make the choice explicit.

## Diagnostics Summary

- **Warning**: multiple constructors, no `[TickerQConstructor]`  
  Only the first constructor is used. Consider annotating one constructor to make the intent explicit.
- **Error**: multiple constructors with `[TickerQConstructor]`  
  Only one constructor can be marked; remove the extra attributes.

