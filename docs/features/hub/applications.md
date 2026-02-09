# Creating an Application

Applications in TickerQ Hub represent your distributed job scheduling setup. Each application has its own API credentials and can have multiple SDK nodes connected to it.

## Create a New Application

1. From your Hub dashboard, click **New Application** or **Create Application**
2. Enter the application details:
   - **Name** - A descriptive name for your application (e.g., "Production Scheduler", "Dev Environment")
   - **Description** (optional) - Additional context about the application's purpose
3. Click **Create**

## Application Credentials

After creating an application, you'll receive:

| Credential | Description |
|------------|-------------|
| **API Key** | Public identifier for your application |
| **API Secret** | Private key for authentication (keep this secure!) |

::: warning Security
Store your API Secret securely. It cannot be retrieved later - only regenerated.
:::

## Using Credentials

Use these credentials in both your SDK apps and RemoteExecutor:

### SDK Configuration

```csharp
services.AddTickerQSdk(options =>
{
    options.HubUrl = "https://hub.tickerq.net";
    options.ApiKey = "your-api-key";
    options.ApiSecret = "your-api-secret";
    options.NodeName = "node-1";
    options.CallbackUri = "https://your-app.com";
});
```

### RemoteExecutor Configuration

```csharp
services.AddTickerQRemoteExecutor(options =>
{
    options.HubUrl = "https://hub.tickerq.net";
    options.ApiKey = "your-api-key";
    options.ApiSecret = "your-api-secret";
});
```

## Managing Applications

### View Application Details

Click on any application from your dashboard to view:

- Connected nodes and their status
- Registered functions
- Recent activity logs
- Application settings

### Regenerate Credentials

If your API Secret is compromised:

1. Go to **Application Settings**
2. Click **Regenerate Secret**
3. Update all SDK and RemoteExecutor configurations with the new secret

::: danger
Regenerating the secret will disconnect all currently connected nodes until they're updated with the new credentials.
:::

### Delete an Application

1. Go to **Application Settings**
2. Click **Delete Application**
3. Confirm the deletion

::: warning
Deleting an application removes all associated nodes, functions, and configuration. This action cannot be undone.
:::

## Next Steps

- [Manage Nodes](./nodes) - Add and configure SDK nodes
- [SDK Setup](./sdk) - Set up TickerQ.SDK in your .NET application
- [Remote Executor Setup](./remote-executor) - Configure your scheduler host
