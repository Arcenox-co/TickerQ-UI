# Dashboard Setup

The **TickerQ.Dashboard** package provides a ready-to-use, real-time interface to monitor and manage your background jobs. It supports both **CronTicker** and **TimeTicker** entries and displays live job status, execution history, concurrency levels, and more.

---

## Install the Dashboard Package

>You can install it with:
>::: code-group
>```cli [.NET CLI]
>> dotnet add package TickerQ.Dashboard
>```
>```pm [Package Manager]
>PM> NuGet\Install-Package TickerQ.Dashboard
>```
>```pm [Package Reference]
><PackageReference Include="TickerQ.Dashboard" Version="*" />
>```
>:::

## Basic Configuration

Update your `Program.cs` to register the dashboard support:

```csharp
builder.Services.AddTickerQ(opt => // [!code focus]
{
    opt.AddOperationalStore<WebAppDbContext>();
    opt.SetInstanceIdentifier("TickerQ");
    opt.CancelMissedTickersOnApplicationRestart();

    // Enable Dashboard // [!code focus]
    opt.AddDashboard(basePath: "/tickerq-dashboard"); // [!code focus]
    opt.AddDashboardBasicAuth(); // [!code focus]
});
```

This exposes the dashboard at `/tickerq-dashboard` by default.

---

## Securing the Dashboard (Optional)

You can control access to the dashboard using built-in Basic Auth.

Add the following to your `appsettings.json`:

```json
"TickerQBasicAuth": {
  "Username": "admin",
  "Password": "admin"
}
```

This enables a login form at the dashboard endpoint using the credentials above.

By default, `AddDashboardBasicAuth()` enables a simple login screen with username/password from appsettings.

---

## EF Core Required

The dashboard requires jobs to be persisted via `TickerQ.EntityFramework`. Make sure the EF store is configured.

> See [EF Core Setup](/setup/tickerq-ef-core) if not already configured.

---

## Features

The dashboard includes:

- Job execution logs and history
- Visual breakdown of job statuses (success, failed, pending)
- Concurrency insights (running threads, queued jobs)
- Real-time refresh via SignalR
- Manual job trigger support
- Cancel running jobs directly from the dashboard
- Add new jobs (CronTicker or TimeTicker) from the dashboard
- Edit existing jobs and reschedule them
- Delete or disable jobs manually
- Duplicate existing jobs with a new schedule or name

## Summary

- Install `TickerQ.Dashboard`
- Register it with `.AddDashboard()` and `.AddDashboardBasicAuth()`
- Use middleware `app.UseTickerQDashboard()`
- Secure and customize as needed
