# TickerQ Hub

TickerQ Hub is the **central registry service** that connects remote applications (using `TickerQ.SDK`) with a scheduler host (using `TickerQ.RemoteExecutor`).

::: warning Important
The Hub is a **metadata registry only** - it does NOT execute jobs. All job execution happens on the Scheduler (RemoteExecutor), which calls back to SDK nodes directly.
:::

The Hub runs at `https://hub.tickerq.net/` and provides:
- Function registration and metadata storage
- Webhook signature distribution for secure communication
- Scheduler URL configuration for SDK nodes

## Architecture Overview

```
┌─────────────────┐                              ┌─────────────────┐
│   SDK Apps      │                              │    Scheduler    │
│  (Your Apps)    │                              │(RemoteExecutor) │
└────────┬────────┘                              └────────┬────────┘
         │                                                │
         │         ┌─────────────────┐                    │
         │         │   TickerQ Hub   │                    │
         │         │  (Registry Only)│                    │
         │         └────────┬────────┘                    │
         │                  │                             │
         │ 1. Register      │        2. Sync functions    │
         │    functions ───►│◄───────────────────────────│
         │                  │    (get SDK callback URLs)  │
         │                                                │
         │ 3. Schedule jobs (create/update/delete)        │
         │ ──────────────────────────────────────────────►│
         │                                                │
         │ 4. Execute via callback (direct)               │
         │ ◄──────────────────────────────────────────────│
```

## When to Use the Hub

Use the Hub when you want:

- **Distributed architecture**: Remote applications register functions and receive execution callbacks from a central scheduler.
- **Centralized configuration**: A single place to manage function metadata across multiple environments.
- **Secure communication**: HMAC-signed webhook delivery between the scheduler and remote nodes.
- **Decoupled scheduling**: SDK apps don't need to know where the scheduler is - the Hub provides that information.

## Complete Flow

### 1. SDK Registration (Startup)
The SDK app sends its function metadata and callback URL to the Hub using API Key/Secret authentication.

### 2. Hub Response
The Hub stores the metadata and returns:
- `WebhookSignature` - HMAC secret for signing/verifying callbacks
- `ApplicationUrl` - The Scheduler URL for job operations

### 3. Scheduler Sync (Startup)
The Scheduler (RemoteExecutor) fetches all registered nodes and functions from the Hub, including their callback URLs.

### 4. Job Scheduling
When the SDK app wants to schedule a job, it sends the request **directly to the Scheduler** (not the Hub).

### 5. Job Execution
When a job is due, the Scheduler calls the SDK app's `/execute` endpoint **directly** with an HMAC-signed payload.

## Components

| Component | Purpose | Executes Jobs? |
|-----------|---------|----------------|
| **TickerQ.Hub** | Function registry, credential management | ❌ No |
| **TickerQ.SDK** | Register functions, receive callbacks, schedule jobs | ❌ No (receives callbacks) |
| **TickerQ.RemoteExecutor** | Store jobs, schedule execution, call SDK callbacks | ✅ Yes |

## Credentials and Identifiers

The Hub issues credentials for your application:

| Credential | Used By | Purpose |
|------------|---------|---------|
| `ApiKey` | SDK, RemoteExecutor | Hub authentication |
| `ApiSecret` | SDK, RemoteExecutor | Hub authentication |
| `NodeName` | SDK | Identifies a specific SDK node |
| `CallbackUri` | SDK | Public URL where Scheduler calls `/execute` |
| `WebhookSignature` | SDK, RemoteExecutor | HMAC secret for signing callbacks |

## Security Model

All communication uses HMAC-SHA256 signatures:

| Communication | Authentication |
|---------------|----------------|
| SDK → Hub | `X-Api-Key` + `X-Api-Secret` headers |
| RemoteExecutor → Hub | `X-Api-Key` + `X-Api-Secret` headers |
| SDK → Scheduler | `X-TickerQ-Signature` + `X-Timestamp` headers |
| Scheduler → SDK | `X-TickerQ-Signature` + `X-Timestamp` headers |

The `WebhookSignature` is issued by the Hub during sync and shared between SDK and Scheduler to validate direct communication.

## Next Steps

- [Getting Started](./getting-started) - Create your Hub account
- [Create an Application](./applications) - Set up your first application
- [Manage Nodes](./nodes) - Configure SDK nodes
- [SDK Setup](./sdk) - Configure your application to register functions
- [Remote Executor Setup](./remote-executor) - Configure your scheduler host
