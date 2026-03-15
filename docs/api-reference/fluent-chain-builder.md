# FluentChainTickerBuilder

Fluent builder for constructing parent-child job chains. Supports up to 5 children per parent and 5 grandchildren per child, with `RunCondition`-based execution control.

## Type Definition

```csharp
namespace TickerQ.Utilities.Managers;

public class FluentChainTickerBuilder<TTimeTicker>
    where TTimeTicker : TimeTickerEntity<TTimeTicker>, new()
```

## Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `BeginWith(Action<ParentBuilder<TTimeTicker>> configure)` | `FluentChainTickerBuilder<TTimeTicker>` | Start building a chain by configuring the root (parent) ticker |

## Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `WithFirstChild(Action<ChildBuilder<TTimeTicker>> configure)` | `FirstChildBuilder` | Configure the 1st child ticker |
| `WithSecondChild(Action<ChildBuilder<TTimeTicker>> configure)` | `SecondChildBuilder` | Configure the 2nd child ticker |
| `WithThirdChild(Action<ChildBuilder<TTimeTicker>> configure)` | `ThirdChildBuilder` | Configure the 3rd child ticker |
| `WithFourthChild(Action<ChildBuilder<TTimeTicker>> configure)` | `FourthChildBuilder` | Configure the 4th child ticker |
| `WithFifthChild(Action<ChildBuilder<TTimeTicker>> configure)` | `FifthChildBuilder` | Configure the 5th child ticker |
| `Build()` | `TTimeTicker` | Build and return the complete ticker chain entity |

## ParentBuilder\<TTimeTicker\>

Configures the root ticker of the chain.

| Method | Returns | Description |
|--------|---------|-------------|
| `SetFunction(string functionName)` | `ParentBuilder<TTimeTicker>` | Set the ticker function name |
| `SetDescription(string description)` | `ParentBuilder<TTimeTicker>` | Set the ticker description |
| `SetExecutionTime(DateTime executionTime)` | `ParentBuilder<TTimeTicker>` | Set when the parent should execute |
| `SetRequest<T>(T request)` | `ParentBuilder<TTimeTicker>` | Set the request payload (serialized via `TickerHelper`) |
| `SetRetries(int retries, params int[] intervals)` | `ParentBuilder<TTimeTicker>` | Set retry count and intervals (in seconds) |

## ChildBuilder\<TTimeTicker\>

Configures a child ticker. Includes all `ParentBuilder` methods plus:

| Method | Returns | Description |
|--------|---------|-------------|
| `SetRunCondition(RunCondition condition)` | `ChildBuilder<TTimeTicker>` | Set when this child should run relative to the parent's status |

## GrandChildBuilder\<TTimeTicker\>

Configures a grandchild ticker. Same methods as `ChildBuilder`.

| Method | Returns | Description |
|--------|---------|-------------|
| `SetFunction(string functionName)` | `GrandChildBuilder<TTimeTicker>` | Set the ticker function name |
| `SetDescription(string description)` | `GrandChildBuilder<TTimeTicker>` | Set the ticker description |
| `SetRunCondition(RunCondition condition)` | `GrandChildBuilder<TTimeTicker>` | Set when this grandchild should run relative to the child's status |
| `SetExecutionTime(DateTime executionTime)` | `GrandChildBuilder<TTimeTicker>` | Set execution time |
| `SetRequest<T>(T request)` | `GrandChildBuilder<TTimeTicker>` | Set the request payload |
| `SetRetries(int retries, params int[] intervals)` | `GrandChildBuilder<TTimeTicker>` | Set retry count and intervals |

## Child Builder Chaining

Each child builder also exposes methods to add subsequent children and grandchildren:

- `FirstChildBuilder` → can add 2nd-5th children + up to 5 grandchildren
- `SecondChildBuilder` → can add 3rd-5th children + up to 5 grandchildren
- `ThirdChildBuilder` → can add 4th-5th children + up to 5 grandchildren
- `FourthChildBuilder` → can add 5th child + up to 5 grandchildren
- `FifthChildBuilder` → can add up to 5 grandchildren

All child builders have a `Build()` method and support implicit conversion to `TTimeTicker`.

## Constraints

- Maximum **5 children** per parent
- Maximum **5 grandchildren** per child
- Each child/grandchild slot can only be configured once (throws `InvalidOperationException` on duplicate)
- Only available for `TimeTickerEntity` (not CronTickers)

## See Also

- [Job Chaining](/concepts/job-chaining) — Conceptual guide
- [RunCondition](/api-reference/entities/enums#runcondition) — Execution condition values
- [TimeTickerEntity](/api-reference/entities/time-ticker-entity) — Parent/Children properties
- [ITimeTickerManager](/api-reference/managers/time-ticker-manager) — `AddAsync` to persist chains
