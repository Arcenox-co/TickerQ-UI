# Dashboard Authentication

Configure authentication methods for securing the TickerQ Dashboard.

## Authentication Methods

TickerQ Dashboard supports multiple authentication methods:

### [WithNoAuth](./authentication#withnoauth)
Public dashboard with no authentication.

### [WithBasicAuth](./authentication#withbasicauth)
Simple username/password authentication.

### [WithApiKey](./authentication#withapikey)
API key authentication (sent as Bearer token).

### [WithHostAuthentication](./authentication#withhostauthentication)
Use your application's existing authentication system.

### [WithCustomAuth](./authentication#withcustomauth)
Custom validation function.

### [WithSessionTimeout](./authentication#withsessiontimeout)
Configure session timeout.

## WithNoAuth

Configure a public dashboard with no authentication.

**Method:**
```csharp
DashboardOptionsBuilder WithNoAuth();
```

**Example:**
```csharp
dashboardOptions.WithNoAuth();
```

**Security Warning:** Only use this in development or internal networks. Never expose an unauthenticated dashboard to the internet.

**When to Use:**
- Development environments
- Internal networks with other security measures
- Testing and debugging

## WithBasicAuth

Enable username/password authentication.

**Method:**
```csharp
DashboardOptionsBuilder WithBasicAuth(string username, string password);
```

**Example:**
```csharp
dashboardOptions.WithBasicAuth("admin", "secure-password");
```

**How It Works:**
- Users are prompted for username and password
- Credentials are encoded and sent with each request
- Simple HTTP Basic Authentication

**Best Practices:**
- Use strong passwords
- Store credentials in configuration (not hardcoded)
- Consider changing passwords regularly
- Use HTTPS in production

**Example from Configuration:**
```csharp
dashboardOptions.WithBasicAuth(
    builder.Configuration["TickerQ:Dashboard:Username"] ?? "admin",
    builder.Configuration["TickerQ:Dashboard:Password"] ?? throw new Exception("Password required")
);
```

## WithApiKey

Enable API key authentication (sent as Bearer token).

**Method:**
```csharp
DashboardOptionsBuilder WithApiKey(string apiKey);
```

**Example:**
```csharp
dashboardOptions.WithApiKey("your-secret-api-key-12345");
```

**How It Works:**
- Users enter an API key in the dashboard login
- API key is sent as a Bearer token in the Authorization header
- Frontend stores and sends the key with each request

**Best Practices:**
- Use long, random API keys
- Store keys securely in configuration
- Rotate keys periodically
- Consider key management services

**Example from Configuration:**
```csharp
var apiKey = builder.Configuration["TickerQ:Dashboard:ApiKey"] 
    ?? throw new Exception("Dashboard API key required");
    
dashboardOptions.WithApiKey(apiKey);
```

## WithHostAuthentication

Use your application's existing authentication system.

**Method:**
```csharp
DashboardOptionsBuilder WithHostAuthentication(string? policy = null);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `policy` | `string?` | Optional authorization policy name to require (e.g., "AdminPolicy"). If null or empty, uses the default policy. |

**Example:**
```csharp
// Use default authentication (any authenticated user)
dashboardOptions.WithHostAuthentication();

// Require a specific authorization policy
dashboardOptions.WithHostAuthentication("AdminPolicy");
```

**How It Works:**
- Delegates authentication to your application's middleware
- Works with ASP.NET Core Identity, JWT, Cookies, etc.
- Uses the same authentication context as your app
- Optionally enforces a specific authorization policy

**Requirements:**
- Authentication middleware must be configured in your application
- User must be authenticated to access dashboard
- If a policy is specified, user must satisfy that policy

**Example Setup:**
```csharp
// Configure your app's authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* ... */ });

// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy =>
        policy.RequireRole("Admin"));
});

// Configure TickerQ Dashboard with policy
options.AddDashboard(dashboardOptions =>
{
    dashboardOptions.SetBasePath("/admin/tickerq");
    dashboardOptions.WithHostAuthentication("AdminPolicy"); // Requires Admin role
});
```

**Without Policy (Any Authenticated User):**
```csharp
options.AddDashboard(dashboardOptions =>
{
    dashboardOptions.SetBasePath("/admin/tickerq");
    dashboardOptions.WithHostAuthentication(); // Any authenticated user can access
});
```

## WithCustomAuth

Configure custom authentication with a validation function.

**Method:**
```csharp
DashboardOptionsBuilder WithCustomAuth(Func<string, bool> validator);
```

**Example:**
```csharp
dashboardOptions.WithCustomAuth(token =>
{
    // Your custom validation logic
    return ValidateToken(token);
});
```

**Custom Validation Example:**
```csharp
dashboardOptions.WithCustomAuth(token =>
{
    // Validate against external service
    var isValid = _tokenService.ValidateAsync(token).Result;
    
    // Check token expiration
    var tokenData = ParseToken(token);
    if (tokenData.ExpiresAt < DateTime.UtcNow)
        return false;
    
    // Check permissions
    return tokenData.HasPermission("TickerQ:Access");
});
```

**Use Cases:**
- Integration with external authentication services
- Custom token validation logic
- Complex permission checks
- Legacy authentication systems

## WithSessionTimeout

Set session timeout in minutes.

**Method:**
```csharp
DashboardOptionsBuilder WithSessionTimeout(int minutes);
```

**Example:**
```csharp
dashboardOptions.WithSessionTimeout(minutes: 60);
```

**Default:** Depends on authentication method

**Example:**
```csharp
dashboardOptions.WithBasicAuth("admin", "password");
dashboardOptions.WithSessionTimeout(120); // 2 hours
```

## Complete Authentication Examples

### Basic Auth in Production
```csharp
options.AddDashboard(dashboardOptions =>
{
    dashboardOptions.SetBasePath("/admin/tickerq");
    dashboardOptions.WithBasicAuth(
        builder.Configuration["Dashboard:Username"] ?? "admin",
        builder.Configuration["Dashboard:Password"] ?? throw new Exception("Password required")
    );
    dashboardOptions.WithSessionTimeout(60);
});
```

### API Key Authentication
```csharp
options.AddDashboard(dashboardOptions =>
{
    dashboardOptions.SetBasePath("/tickerq");
    dashboardOptions.WithApiKey(builder.Configuration["Dashboard:ApiKey"]);
    dashboardOptions.WithSessionTimeout(120);
});
```

### Host Authentication
```csharp
// In Program.cs
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => { /* ... */ });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("DashboardAccess", policy =>
        policy.RequireRole("Admin", "Manager"));
});

// TickerQ configuration
options.AddDashboard(dashboardOptions =>
{
    dashboardOptions.SetBasePath("/admin/tickerq");
    dashboardOptions.WithHostAuthentication("DashboardAccess"); // Requires Admin or Manager role
});
```

## Security Best Practices

1. **Always use authentication in production**
2. **Use HTTPS** - Never send credentials over HTTP
3. **Store credentials securely** - Use configuration/secrets, not code
4. **Use strong passwords/keys** - Long, random values
5. **Set appropriate timeouts** - Balance security and usability
6. **Rotate credentials** - Change passwords/keys periodically
7. **Monitor access** - Log authentication attempts

## Switching Authentication Methods

You can only use one authentication method at a time. The last method configured wins:

```csharp
dashboardOptions.WithBasicAuth("admin", "password");
dashboardOptions.WithApiKey("key"); // This replaces BasicAuth
// Result: Only API key authentication is active
```

## See Also

- [Basic Setup](./basic-setup) - Path and CORS configuration
- [Dashboard Guide](../../../features/dashboard) - Complete dashboard setup
- [Configuration Overview](../index) - All configuration sections

