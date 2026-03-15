# Email Notifications

Common patterns for sending emails with TickerQ.

## Send Welcome Email After Registration

Schedule a welcome email 5 minutes after user registration:

```csharp
public class EmailJobs
{
    private readonly IEmailService _emailService;
    
    public EmailJobs(IEmailService emailService)
    {
        _emailService = emailService;
    }
    
    [TickerFunction("SendWelcomeEmail")]
    public async Task SendWelcomeEmail(
        TickerFunctionContext<WelcomeEmailRequest> context,
        CancellationToken cancellationToken)
    {
        var request = context.Request;
        
        await _emailService.SendAsync(
            to: request.Email,
            subject: "Welcome!",
            body: $"Hello {request.Name}, welcome to our platform!",
            cancellationToken
        );
    }
}

// In your user registration service
public async Task RegisterUserAsync(UserDto userDto)
{
    // Create user...
    var user = await CreateUserAsync(userDto);
    
    // Schedule welcome email
    await _timeTickerManager.AddAsync(new TimeTickerEntity
    {
        Function = "SendWelcomeEmail",
        ExecutionTime = DateTime.UtcNow.AddMinutes(5),
        Request = TickerHelper.CreateTickerRequest(new WelcomeEmailRequest
        {
            Email = user.Email,
            Name = user.Name,
            UserId = user.Id
        }),
        Description = $"Welcome email for {user.Email}",
        Retries = 3,
        RetryIntervals = new[] { 60, 300, 900 }
    });
}
```

## Send Reminder Emails

Send daily reminders to inactive users:

```csharp
[TickerFunction("SendReminderEmail", cronExpression: "0 0 9 * * *")]
public async Task SendReminderEmail(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var users = await _dbContext.Users
        .Where(u => u.LastLoginDate < DateTime.UtcNow.AddDays(-7))
        .ToListAsync();

    foreach (var user in users)
    {
        await _emailService.SendAsync(
            to: user.Email,
            subject: "We miss you!",
            body: "Come back and check out what's new.",
            cancellationToken
        );
    }
}
```

## Send Bulk Notifications

Send notifications to multiple recipients efficiently:

```csharp
[TickerFunction("SendBulkNotifications")]
public async Task SendBulkNotifications(
    TickerFunctionContext<BulkNotificationRequest> context,
    CancellationToken cancellationToken)
{
    var request = context.Request;
    
    var tasks = request.Recipients.Select(recipient => 
        _emailService.SendAsync(
            to: recipient.Email,
            subject: request.Subject,
            body: request.Body.Replace("{Name}", recipient.Name),
            cancellationToken
        )
    );
    
    await Task.WhenAll(tasks);
}
```

## See Also

- [Database Cleanup](./database-cleanup) - Other common patterns
- [Error Handling](../../concepts/error-handling) - Handling email failures
- [Retry Strategies](./retry-strategies) - Retry configurations for email jobs

