# Managing Nodes

Nodes represent individual SDK instances that register functions with TickerQ Hub. Each node has a unique name and callback URL where the scheduler sends job execution requests.

## Understanding Nodes

A **node** is a running instance of your application with `TickerQ.SDK` installed. When the SDK starts, it:

1. Connects to the Hub using your application credentials
2. Registers itself with a unique `NodeName`
3. Sends its `CallbackUri` for receiving execution callbacks
4. Registers all functions marked with `[TickerFunction]`

## Node Configuration

Each SDK node requires:

| Setting | Description | Example |
|---------|-------------|---------|
| `NodeName` | Unique identifier for this instance | `"api-server-1"`, `"worker-east"` |
| `CallbackUri` | Public URL where scheduler sends callbacks | `"https://api.example.com"` |

```csharp
services.AddTickerQSdk(options =>
{
    options.HubUrl = "https://hub.tickerq.net";
    options.ApiKey = "your-api-key";
    options.ApiSecret = "your-api-secret";
    options.NodeName = "worker-node-1";  // Unique per instance
    options.CallbackUri = "https://worker1.example.com";
});
```

## Viewing Nodes in the Hub

From your application dashboard, you can see:

- **Node Name** - The identifier for each connected node
- **Callback URL** - Where execution requests are sent
- **Status** - Online/Offline status
- **Functions** - List of registered functions on this node
- **Last Sync** - When the node last synchronized with the Hub

## Multiple Nodes

You can run multiple SDK nodes for the same application:

```
Application: "Order Processing"
├── Node: "worker-east-1"  → https://east1.example.com
├── Node: "worker-east-2"  → https://east2.example.com
└── Node: "worker-west-1"  → https://west1.example.com
```

::: tip Load Distribution
The scheduler will call the specific node where a function is registered. For distributed execution across nodes, register the same function on multiple nodes.
:::

## Node Lifecycle

### Registration

When an SDK app starts, it automatically registers with the Hub. The Hub:

1. Validates the API credentials
2. Creates or updates the node record
3. Stores all function metadata
4. Returns the `WebhookSignature` and `ApplicationUrl` (scheduler URL)

### Heartbeat

Nodes periodically sync with the Hub to:

- Confirm they're still online
- Update function registrations if changed
- Refresh credentials

### Deregistration

When a node goes offline:

- The Hub marks it as inactive after missed heartbeats
- The scheduler stops sending execution requests to that node
- Functions registered only on that node become unavailable

## Troubleshooting

### Node Not Appearing

- Verify API Key and Secret are correct
- Check that the SDK app started successfully
- Review application logs for connection errors

### Node Showing Offline

- Ensure the application is running
- Check network connectivity to `hub.tickerq.net`
- Verify firewall rules allow outbound HTTPS

### Callback Failures

- Confirm `CallbackUri` is publicly accessible
- Check that the URL doesn't require authentication
- Verify SSL certificate is valid (HTTPS required)

## Next Steps

- [SDK Setup](./sdk) - Detailed SDK configuration guide
- [Remote Executor Setup](./remote-executor) - Configure your scheduler
- [Overview](./index) - Hub architecture and security model
