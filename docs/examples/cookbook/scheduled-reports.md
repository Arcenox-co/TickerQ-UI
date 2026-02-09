# Scheduled Reports

Generate and distribute reports on schedules.

## Generate Daily Report

Generate a daily report at midnight:

```csharp
public class ReportJobs
{
    private readonly AppDbContext _dbContext;
    private readonly IReportService _reportService;
    private readonly IEmailService _emailService;

    public ReportJobs(
        AppDbContext dbContext,
        IReportService reportService,
        IEmailService emailService)
    {
        _dbContext = dbContext;
        _reportService = reportService;
        _emailService = emailService;
    }

    [TickerFunction("GenerateDailyReport", cronExpression: "0 0 0 * * *")]
    public async Task GenerateDailyReport(
        TickerFunctionContext context,
        CancellationToken cancellationToken)
    {
        var yesterday = DateTime.UtcNow.AddDays(-1).Date;
        var today = DateTime.UtcNow.Date;

        // Generate report data
        var reportData = await _dbContext.Orders
            .Where(o => o.CreatedAt >= yesterday && o.CreatedAt < today)
            .GroupBy(o => o.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        // Generate PDF report
        var report = await _reportService.GeneratePdfAsync(reportData, cancellationToken);

        // Email to administrators
        await _emailService.SendToAdminsAsync(
            subject: $"Daily Report - {yesterday:yyyy-MM-dd}",
            attachment: report,
            cancellationToken
        );
    }
}
```

## Weekly Summary

Generate weekly summary every Monday at 9 AM:

```csharp
[TickerFunction("GenerateWeeklySummary", cronExpression: "0 0 9 * * 1")]
public async Task GenerateWeeklySummary(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Runs every Monday at 9 AM
    var lastWeek = DateTime.UtcNow.AddDays(-7);
    
    // Aggregate weekly data
    var summary = await AggregateWeeklyDataAsync(lastWeek, cancellationToken);
    
    // Generate summary report
    var report = await GenerateSummaryReportAsync(summary, cancellationToken);
    
    // Send to stakeholders
    await _emailService.SendToStakeholdersAsync(
        subject: $"Weekly Summary - Week ending {lastWeek:yyyy-MM-dd}",
        body: report,
        cancellationToken
    );
}
```

## Monthly Reports

Generate monthly reports on the first day of each month:

```csharp
[TickerFunction("GenerateMonthlyReport", cronExpression: "0 0 8 1 * *")]
public async Task GenerateMonthlyReport(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var lastMonth = DateTime.UtcNow.AddMonths(-1);
    var startOfMonth = new DateTime(lastMonth.Year, lastMonth.Month, 1);
    var endOfMonth = startOfMonth.AddMonths(1);
    
    // Generate comprehensive monthly report
    var report = await GenerateMonthlyReportAsync(startOfMonth, endOfMonth, cancellationToken);
    
    // Save to storage
    await _storageService.SaveReportAsync(report, cancellationToken);
    
    // Notify recipients
    await _notificationService.NotifyAsync(
        "Monthly report ready",
        cancellationToken
    );
}
```

## Conditional Report Generation

Generate reports only when certain conditions are met:

```csharp
[TickerFunction("GenerateConditionalReport", cronExpression: "0 0 9 * * *")]
public async Task GenerateConditionalReport(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    // Check if report should be generated
    var orderCount = await _dbContext.Orders
        .Where(o => o.CreatedAt >= DateTime.UtcNow.AddDays(-1))
        .CountAsync(cancellationToken);

    if (orderCount < 10)
    {
        _logger.LogInformation("Order count below threshold, skipping report");
        return; // Skip report generation
    }

    // Generate report
    await GenerateReportAsync(cancellationToken);
}
```

## See Also

- [Email Notifications](./email-notifications) - Sending reports via email
- [Database Cleanup](./database-cleanup) - Cleaning up old reports
- [Error Handling](../../concepts/error-handling) - Handling report generation failures

