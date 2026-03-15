# TickerHelper

Static utility class for creating and reading ticker request payloads. Handles JSON serialization and optional GZip compression.

## Type Definition

```csharp
namespace TickerQ.Utilities;

public static class TickerHelper
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `RequestJsonSerializerOptions` | `JsonSerializerOptions` | `new()` | JSON options used for request serialization/deserialization. Configured via `ConfigureRequestJsonOptions()` at startup |
| `UseGZipCompression` | `bool` | `false` | Whether requests are GZip-compressed. Configured via `UseGZipCompression()` at startup |

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `CreateTickerRequest<T>(T data)` | `byte[]` | Serializes `data` to a byte array (JSON or GZip-compressed JSON) for storage in a ticker entity's `Request` property |
| `ReadTickerRequest<T>(byte[] gzipBytes)` | `T` | Deserializes a request byte array back to the original type. Returns `default(T)` if bytes are null or empty |
| `ReadTickerRequestAsString(byte[] gzipBytes)` | `string` | Deserializes a request byte array to its JSON string representation |

## See Also

- [Core Configuration](/api-reference/configuration/core-configuration) — `ConfigureRequestJsonOptions`, `UseGZipCompression`
- [TimeTickerEntity](/api-reference/entities/time-ticker-entity) — `Request` property
- [CronTickerEntity](/api-reference/entities/cron-ticker-entity) — `Request` property
