# Migrations

Create and manage database migrations for TickerQ entities.

## Creating Migrations

### Using Built-in TickerQDbContext

```csharp
# Add migration
dotnet ef migrations add TickerQInitialCreate --context TickerQDbContext

# Apply migration
dotnet ef database update --context TickerQDbContext
```

### Using Application DbContext

```csharp
# Add migration (includes TickerQ entities)
dotnet ef migrations add AddTickerQSupport --context MyApplicationDbContext

# Apply migration
dotnet ef database update --context MyApplicationDbContext
```

### Using Custom Entities

```csharp
# Add migration
dotnet ef migrations add CustomEntitiesInitialCreate --context MyTickerQDbContext

# Apply migration
dotnet ef database update --context MyTickerQDbContext
```

## Migration Setup

### Prerequisites

Ensure Entity Framework Core tools are installed:

```bash
dotnet tool install --global dotnet-ef
```

### Connection String

Configure connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TickerQDb;Trusted_Connection=true;"
  }
}
```

### DbContext Configuration

```csharp
services.AddDbContext<TickerQDbContext>(options =>
    options.UseSqlServer(connectionString));

// Or for application DbContext
services.AddDbContext<MyApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
```

### Design-time DbContext Factory

For migrations to work, create a design-time factory. It is important to note that we need an initialized service collection with TickerQ dependencies registered to ensure the context can run `DbContext.OnConfiguring`.

```csharp
public class TickerQDbContextFactory : IDesignTimeDbContextFactory<TickerQDbContext>
{
    public TickerQDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var services = new ServiceCollection();
        services.AddTickerQ(options =>
        {
            options.AddOperationalStore(ef =>
                ef.UseTickerQDbContext<TickerQDbContext>(
                    efBuilder =>
                        efBuilder.UseSqlServer(
                            configuration.GetConnectionString("DefaultConnection"),
                            b => b.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName!)
                        ),
                    "ticker"
                )
            );
        });

        var serviceProvider = services.BuildServiceProvider();
        var context = serviceProvider.GetRequiredService<TickerQDbContext>();

        return context;
    }
}
```

## Migration Files

TickerQ migrations typically include:

- **TimeTicker** table with scheduling and execution tracking
- **CronTicker** table with cron expression support
- **CronOccurrence** table for cron execution history
- **Indexes** for performance optimization
- **Foreign key relationships** between entities

### Schema Customization

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Custom schema
    modelBuilder.HasDefaultSchema("job_scheduler");

    // Configure TickerQ entities
    modelBuilder.ConfigureTickerQ();
}

// Migration creates tables in "job_scheduler" schema
```

## Reviewing Migrations

Always review generated migration files before applying:

```bash
# Generate migration (dry run)
dotnet ef migrations add ReviewMigration --context TickerQDbContext

# Review the generated files in Migrations/ folder
# Then apply when ready
dotnet ef database update --context TickerQDbContext
```

## Migration Best Practices

1. **Test in Development**: Always test migrations in development first
2. **Backup Production**: Create database backups before applying migrations to production
3. **Review Changes**: Review generated migration files before applying
4. **Incremental Updates**: Create separate migrations for each schema change
5. **Version Control**: Commit migration files to version control

## Rolling Back Migrations

Remove the last migration:

```bash
dotnet ef migrations remove --context TickerQDbContext
```

Roll back to a specific migration:

```bash
dotnet ef database update PreviousMigrationName --context TickerQDbContext
```

## Migration Examples

### Initial Migration

```bash
dotnet ef migrations add InitialTickerQSchema --context TickerQDbContext
```

Generated migration includes:
- TimeTicker table creation
- CronTicker table creation
- CronOccurrence table creation
- Indexes and constraints
- Foreign key relationships

### Adding Custom Properties

```csharp
public class MyTimeTicker : TimeTicker
{
    public string TenantId { get; set; }
}

# Generate migration
dotnet ef migrations add AddTenantIdToTimeTicker --context MyTickerQDbContext
```

Migration adds the new column to existing table.

### Automated Migration

Apply migrations during application startup:

```csharp
public static void Main(string[] args)
{
    var host = CreateHostBuilder(args).Build();

    using (var scope = host.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<TickerQDbContext>();
        context.Database.Migrate(); // Apply pending migrations
    }

    host.Run();
}
```

### Manual Migration

For production, prefer manual migration control:

```yaml
# Docker deployment example
version: '3.8'
services:
  migration:
    image: myapp:latest
    command: dotnet ef database update --context TickerQDbContext
    environment:
      - ConnectionStrings__DefaultConnection=...
    depends_on:
      - database

  app:
    image: myapp:latest
    depends_on:
      - migration
```

Or in CI/CD pipeline:

```yaml
- name: Run Migrations
  run: |
    dotnet ef database update --context TickerQDbContext
    --connection "${{ secrets.CONNECTION_STRING }}"
```

## Troubleshooting

### Migration Conflicts

If multiple developers create migrations simultaneously:
- Merge conflicts in migration files
- Or manually resolve conflicts in migration files

### Design-time Issues

If migration tools can't create DbContext:
- Ensure `IDesignTimeDbContextFactory` is implemented
- Check connection string accessibility
- Verify EF Core tools are installed

### Schema Issues

- Check migration files for correct schema specification
- Ensure custom schema is configured in `OnModelCreating`
- Verify database permissions for schema creation

## Next Steps

- [Database Operations](./database-operations) - Query and manage data
- [Performance](./performance) - Optimization strategies
- [Best Practices](./best-practices) - Production recommendations
