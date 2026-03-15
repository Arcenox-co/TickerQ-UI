# Exception Handling Types

Types related to handling and controlling exceptions during ticker execution.

## ITickerExceptionHandler

Interface for implementing a global exception handler for ticker function failures. Register via `SetExceptionHandler<T>()`.

### Type Definition

```csharp
namespace TickerQ.Utilities.Interfaces;

public interface ITickerExceptionHandler
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)` | `Task` | Called when a ticker function throws an unhandled exception |
| `HandleCanceledExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)` | `Task` | Called when a ticker function is cancelled (via `RequestCancellation()` or timeout) |

---

## TerminateExecutionException

Exception you can throw inside a ticker function to terminate execution with a specific `TickerStatus`. By default, the ticker is marked as `Skipped`.

### Type Definition

```csharp
namespace TickerQ.Exceptions;

public class TerminateExecutionException : Exception
```

### Constructors

| Constructor | Description |
|------------|-------------|
| `TerminateExecutionException(string message)` | Terminate with `Skipped` status and a message |
| `TerminateExecutionException(TickerStatus status, string message)` | Terminate with a specific status and message |
| `TerminateExecutionException(string message, Exception innerException)` | Terminate with `Skipped` status, message, and inner exception |
| `TerminateExecutionException(TickerStatus status, string message, Exception innerException)` | Terminate with specific status, message, and inner exception |

---

## TickerValidatorException

Exception thrown by TickerQ during setup when configuration validation fails (e.g., invalid cron expressions, missing function names).

### Type Definition

```csharp
namespace TickerQ.Utilities.Exceptions;

public class TickerValidatorException : Exception
```

### Constructors

| Constructor | Description |
|------------|-------------|
| `TickerValidatorException(string message)` | Create with validation error message |

::: info
This exception is thrown automatically by TickerQ during startup validation. You typically don't throw it yourself, but you may want to catch it in integration tests or startup error handling.
:::

## See Also

- [Exception Handling Configuration](/api-reference/configuration/core-configuration/exception-handling) — Registration and configuration
- [Error Handling](/concepts/error-handling) — Conceptual guide
- [Enums](/api-reference/entities/enums) — `TickerStatus`, `TickerType` values
