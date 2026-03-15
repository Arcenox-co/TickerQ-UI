# PaginationResult\<T\>

Generic wrapper for paginated query results returned by the dashboard repository and persistence providers.

## Type Definition

```csharp
namespace TickerQ.Utilities.Models;

public class PaginationResult<T>
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `Items` | `IEnumerable<T>` | The page of results |
| `TotalCount` | `int` | Total number of items across all pages |
| `PageNumber` | `int` | Current page number (1-based) |
| `PageSize` | `int` | Number of items per page |
| `TotalPages` | `int` | Calculated total number of pages (`⌈TotalCount / PageSize⌉`) |
| `HasPreviousPage` | `bool` | `true` if `PageNumber > 1` |
| `HasNextPage` | `bool` | `true` if `PageNumber < TotalPages` |
| `FirstItemIndex` | `int` | 1-based index of the first item on this page |
| `LastItemIndex` | `int` | 1-based index of the last item on this page |

## Constructors

| Constructor | Description |
|------------|-------------|
| `PaginationResult()` | Creates empty result with an empty `Items` list |
| `PaginationResult(IEnumerable<T> items, int totalCount, int pageNumber, int pageSize)` | Creates result with specified items and pagination metadata |

## See Also

- [ITimeTickerManager](/api-reference/managers/time-ticker-manager) — Manager API
- [ICronTickerManager](/api-reference/managers/cron-ticker-manager) — Manager API
