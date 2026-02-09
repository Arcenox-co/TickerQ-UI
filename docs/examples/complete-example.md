# Complete Example

This is a complete, production-ready example demonstrating TickerQ in a real-world scenario. Follow along step-by-step to build a notification system with scheduled emails and cleanup jobs.

## Scenario

We'll build a notification system that:
1. Sends welcome emails 5 minutes after user registration
2. Sends daily digest emails at 9 AM
3. Cleans up old notifications daily at midnight
4. Implements proper error handling and retries

## Step-by-Step Walkthrough

### Step 1: Project Setup

## Scenario

We'll build a notification system that:
1. Sends welcome emails 5 minutes after user registration
2. Sends daily digest emails at 9 AM
3. Cleans up old notifications daily at midnight
4. Retries failed emails with exponential backoff

### Step 1: Install Packages

Install the required NuGet packages:

```bash
dotnet add package TickerQ
dotnet add package TickerQ.EntityFrameworkCore
dotnet add package TickerQ.Dashboard
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

**Why these packages?**
- `TickerQ`: Core library (required)
- `TickerQ.EntityFrameworkCore`: For database persistence
- `TickerQ.Dashboard`: For monitoring and management UI
- `Microsoft.EntityFrameworkCore.SqlServer`: Database provider

### Step 2: Create Domain Models

Define your application models:

```csharp
// User.cs
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Notification.cs
public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Message { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

**Design Decision:** These are your domain models. TickerQ entities are separate infrastructure concerns.

### Step 3: Configure Application DbContext (Optional)

If you have application entities that need their own DbContext:

```csharp
// AppDbContext.cs
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Notification> Notifications { get; set; }
}
```

**Note:** TickerQ uses its own built-in `TickerQDbContext` for job persistence, so your application DbContext remains clean and focused on your domain.

### Step 4: Configure Application

```csharp
// Program.cs
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
using TickerQ.EntityFrameworkCore.DbContextFactory;
using TickerQ.Dashboard.DependencyInjection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add Entity Framework for application entities (optional)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add TickerQ with built-in TickerQDbContext
builder.Services.AddTickerQ(options =>
{
    // Core configuration
    options.ConfigureScheduler(schedulerOptions =>
    {
        schedulerOptions.MaxConcurrency = 10;
        schedulerOptions.NodeIdentifier = "notification-server";
    });
    
    options.SetExceptionHandler<NotificationExceptionHandler>();
    
    // Entity Framework persistence using built-in TickerQDbContext
    options.AddOperationalStore(efOptions =>
    {
        efOptions.UseTickerQDbContext<TickerQDbContext>(optionsBuilder =>
        {
            optionsBuilder.UseSqlServer(builder.Configuration.GetConnectionString("TickerQConnection"), 
                cfg =>
                {
                    cfg.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5));
                });
        });
        efOptions.SetDbContextPoolSize(34);
    });
    
    // Dashboard
    options.AddDashboard(dashboardOptions =>
    {
        dashboardOptions.SetBasePath("/admin/tickerq");
        dashboardOptions.WithBasicAuth("admin", "secure-password");
    });
});

var app = builder.Build();

app.UseTickerQ();
app.Run();
```

**Why `TickerQDbContext`?** It's lightweight, optimized for TickerQ, and keeps job persistence separate from your application entities. Connection strings are configured directly in TickerQ options.

### Step 5: Create Job Functions

Define your job functions with proper error handling:

#### 1. Welcome Email Job

```csharp
// NotificationJobs.cs
using TickerQ.Utilities.Base;
using TickerQ.Utilities;

public class NotificationJobs
{
    private readonly IEmailService _emailService;
    private readonly ILogger<NotificationJobs> _logger;
    private readonly AppDbContext _dbContext;

    public NotificationJobs(
        IEmailService emailService,
        ILogger<NotificationJobs> logger,
        AppDbContext dbContext)
    {
        _emailService = emailService;
        _logger = logger;
        _dbContext = dbContext;
    }
    
    [TickerFunction("SendWelcomeEmail")]
    public async Task SendWelcomeEmail(
        TickerFunctionContext context,
        CancellationToken cancellationToken)
    {
        var request = await TickerRequestProvider.GetRequestAsync<WelcomeEmailRequest>(
            context,
            cancellationToken
        );
        
        try
        {
            await _emailService.SendAsync(
                to: request.Email,
                subject: "Welcome!",
                body: $"Hello {request.Name}, welcome to our platform!",
                cancellationToken
            );
            
            _logger.LogInformation("Welcome email sent to {Email}", request.Email);
        }
        catch (SmtpException ex)
        {
            _logger.LogError(ex, "Failed to send welcome email to {Email}", request.Email);
            throw; // Retry on SMTP errors
        }
    }
}
```

#### 2. Daily Digest Job

**Decision:** Use cron expression to run daily at 9 AM. This runs automatically without manual scheduling.

```csharp
    [TickerFunction("SendDailyDigest", cronExpression: "0 0 9 * * *")]
public async Task SendDailyDigest(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    _logger.LogInformation("Starting daily digest job");

    var users = await _dbContext.Users.ToListAsync(cancellationToken);

    foreach (var user in users)
    {
        try
        {
            var notifications = await _dbContext.Notifications
                .Where(n => n.UserId == user.Id
                    && n.CreatedAt >= DateTime.UtcNow.AddDays(-1))
                .ToListAsync(cancellationToken);

            if (notifications.Any())
            {
                await _emailService.SendAsync(
                    to: user.Email,
                    subject: "Daily Digest",
                    body: FormatDigest(notifications),
                    cancellationToken
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send digest to {Email}", user.Email);
            // Continue with other users
        }
    }

    _logger.LogInformation("Daily digest job completed");
}

private string FormatDigest(List<Notification> notifications)
{
    var sb = new StringBuilder();
    sb.AppendLine("Your daily digest:");
    foreach (var notification in notifications)
    {
        sb.AppendLine($"- {notification.Message}");
    }
    return sb.ToString();
}
```

#### 3. Cleanup Job

**Decision:** Run at midnight (2 AM server time) to avoid peak usage hours.

```csharp
    [TickerFunction("CleanupOldNotifications", cronExpression: "0 0 0 * * *")]
public async Task CleanupOldNotifications(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    var cutoffDate = DateTime.UtcNow.AddDays(-30);

    var oldNotifications = await _dbContext.Notifications
        .Where(n => n.CreatedAt < cutoffDate)
        .ToListAsync(cancellationToken);

    _dbContext.Notifications.RemoveRange(oldNotifications);
    await _dbContext.SaveChangesAsync(cancellationToken);

    _logger.LogInformation("Cleaned up {Count} old notifications", oldNotifications.Count);
}
```

### Step 6: Create Request Models

Define typed request models for job data:

```csharp
// WelcomeEmailRequest.cs
public class WelcomeEmailRequest
{
    public string Email { get; set; }
    public string Name { get; set; }
    public Guid UserId { get; set; }
}
```

**Why typed requests?** Provides compile-time safety and easier debugging.

### Step 7: Integrate with Application Services

```csharp
// UserService.cs
public class UserService
{
    private readonly AppDbContext _context;
    private readonly ITimeTickerManager<TimeTickerEntity> _timeTickerManager;
    
    public UserService(
        AppDbContext context,
        ITimeTickerManager<TimeTickerEntity> timeTickerManager)
    {
        _context = context;
        _timeTickerManager = timeTickerManager;
    }
    
    public async Task<User> RegisterUserAsync(string email, string name)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Name = name,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        // Schedule welcome email
        await _timeTickerManager.AddAsync(new TimeTickerEntity
        {
            Function = "SendWelcomeEmail",
            ExecutionTime = DateTime.UtcNow.AddMinutes(5),
            Request = TickerHelper.CreateTickerRequest(new WelcomeEmailRequest
            {
                Email = email,
                Name = name,
                UserId = user.Id
            }),
            Description = $"Welcome email for {email}",
            Retries = 3,
            RetryIntervals = new[] { 60, 300, 900 } // Exponential backoff
        });
        
        return user;
    }
}
```

## Exception Handler

```csharp
// NotificationExceptionHandler.cs
using TickerQ.Utilities.Interfaces;
using TickerQ.Utilities.Enums;

public class NotificationExceptionHandler : ITickerExceptionHandler
{
    private readonly ILogger<NotificationExceptionHandler> _logger;
    private readonly IAlertService _alertService;
    
    public NotificationExceptionHandler(
        ILogger<NotificationExceptionHandler> logger,
        IAlertService alertService)
    {
        _logger = logger;
        _alertService = alertService;
    }
    
    public async Task HandleExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogError(exception,
            "Job {TickerId} ({TickerType}) failed",
            tickerId, tickerType);
        
        // Send alert for critical failures
        if (exception is SmtpException)
        {
            await _alertService.SendAlertAsync(
                "Email service failure",
                exception.ToString()
            );
        }
    }
    
    public async Task HandleCanceledExceptionAsync(
        Exception exception,
        Guid tickerId,
        TickerType tickerType)
    {
        _logger.LogWarning(
            "Job {TickerId} ({TickerType}) was cancelled",
            tickerId, tickerType);
        await Task.CompletedTask;
    }
}
```

## Controller

```csharp
// UserController.cs
[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    
    public UserController(UserService userService)
    {
        _userService = userService;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = await _userService.RegisterUserAsync(
            request.Email,
            request.Name
        );
        
        return Ok(new { userId = user.Id });
    }
}
```

## Running the Example

### 1. Create Database

```bash
dotnet ef migrations add InitialCreate --context AppDbContext
dotnet ef database update --context AppDbContext
```

### 2. Run Application

```bash
dotnet run
```

### 3. Test Registration

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe"}'
```

### 4. Monitor Dashboard

Visit `http://localhost:5000/admin/tickerq` and log in with:
- Username: `admin`
- Password: `secure-password`

## What Happens

1. **User Registration**: User registers, and a TimeTicker is scheduled for 5 minutes later
2. **Welcome Email**: After 5 minutes, the welcome email job executes
3. **Daily Digest**: Every day at 9 AM, daily digest emails are sent
4. **Cleanup**: Every day at midnight, old notifications are cleaned up
5. **Retries**: If email sending fails, jobs retry with exponential backoff
6. **Monitoring**: All jobs are visible in the dashboard

## Next Steps

- [Learn About Job Types](/concepts/job-types)
- [Explore Advanced Features](/concepts/job-fundamentals)
- [Configure Error Handling](/concepts/error-handling)

