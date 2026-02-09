# Dashboard Basic Setup

Configure the dashboard URL path, backend domain, and CORS policies.

## SetBasePath

Set the URL path where the dashboard will be accessible.

**Method:**
```csharp
void SetBasePath(string basePath);
```

**Type:** `string`
**Default:** `"/tickerq/dashboard"`

**Example:**
```csharp
dashboardOptions.SetBasePath("/admin/tickerq");
```

Dashboard will be available at: `http://localhost:5000/admin/tickerq`

**Common Paths:**
```csharp
// Simple path
dashboardOptions.SetBasePath("/tickerq");

// Admin area
dashboardOptions.SetBasePath("/admin/jobs");

// Nested path
dashboardOptions.SetBasePath("/dashboard/tickerq");
```

**Important:** Ensure the path doesn't conflict with your application routes.

## SetBackendDomain

Set backend API domain for cross-origin scenarios.

**Method:**
```csharp
void SetBackendDomain(string backendDomain);
```

**Type:** `string`

**Example:**
```csharp
dashboardOptions.SetBackendDomain("https://api.example.com");
```

**When to Use:**
- Dashboard is served from a different domain
- Frontend and backend are on different hosts
- Using a CDN for dashboard assets

**Example Configuration:**
```csharp
options.AddDashboard(dashboardOptions =>
{
    dashboardOptions.SetBasePath("/tickerq");
    dashboardOptions.SetBackendDomain("https://api.myapp.com");
});
```

## SetCorsPolicy

Configure CORS (Cross-Origin Resource Sharing) policy.

**Method:**
```csharp
void SetCorsPolicy(Action<CorsPolicyBuilder> corsPolicyBuilder);
```

**Example:**
```csharp
dashboardOptions.SetCorsPolicy(cors =>
{
    cors.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
});
```

**Production-Ready CORS:**
```csharp
dashboardOptions.SetCorsPolicy(cors =>
{
    cors.WithOrigins("https://dashboard.myapp.com", "https://admin.myapp.com")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
});
```

**Specific Origins:**
```csharp
dashboardOptions.SetCorsPolicy(cors =>
{
    cors.WithOrigins("https://app.example.com")
        .WithMethods("GET", "POST", "PUT", "DELETE")
        .WithHeaders("Authorization", "Content-Type");
});
```

## Complete Basic Setup

```csharp
builder.Services.AddTickerQ(options =>
{
    options.AddDashboard(dashboardOptions =>
    {
        // Base path
        dashboardOptions.SetBasePath("/admin/tickerq");
        
        // Backend domain (if different)
        // dashboardOptions.SetBackendDomain("https://api.example.com");
        
        // CORS policy (if needed)
        dashboardOptions.SetCorsPolicy(cors =>
        {
            cors.WithOrigins("https://myapp.com")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
        
        // Authentication (see Authentication guide)
        dashboardOptions.WithBasicAuth("admin", "secure-password");
    });
});
```

## Path Configuration Examples

### Development
```csharp
dashboardOptions.SetBasePath("/tickerq/dashboard");
// Access at: http://localhost:5000/tickerq/dashboard
```

### Production
```csharp
dashboardOptions.SetBasePath("/admin/jobs");
// Access at: https://myapp.com/admin/jobs
```

### Custom Domain
```csharp
dashboardOptions.SetBasePath("/");
dashboardOptions.SetBackendDomain("https://tickerq-api.myapp.com");
// Dashboard on main domain, API on subdomain
```

## Troubleshooting

### Dashboard Not Loading

- Verify base path doesn't conflict with application routes
- Check authentication is configured correctly
- Ensure `UseTickerQ()` is called

### CORS Issues

- Configure CORS policy if dashboard is on different domain
- Check browser console for CORS errors
- Verify allowed origins match your frontend URL

### Path Conflicts

If your application has a route that conflicts:
```csharp
// Your application route
app.MapGet("/admin/tickerq", () => "Something else");

// Solution: Use different dashboard path
dashboardOptions.SetBasePath("/tickerq/admin");
```

## See Also

- [Authentication](./authentication) - Secure the dashboard
- [Dashboard Guide](../../../features/dashboard) - Complete dashboard setup
- [Configuration Overview](../index) - All configuration sections

