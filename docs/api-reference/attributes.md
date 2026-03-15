# Attributes

TickerQ uses attributes to discover job handlers and control constructor selection for dependency injection.

## [TickerFunction]

Namespace: `TickerQ.Utilities.Base`

Marks a method as a TickerQ job handler.

**Overloads:**

```csharp
public TickerFunctionAttribute(
    string functionName,
    string cronExpression = null,
    TickerTaskPriority taskPriority = TickerTaskPriority.Normal,
    int maxConcurrency = 0);

public TickerFunctionAttribute(
    string functionName,
    TickerTaskPriority taskPriority,
    int maxConcurrency = 0);
```


### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `functionName` | `string` | required | Logical identifier used when scheduling jobs (`Function` property on ticker entities) |
| `cronExpression` | `string` | `null` | Optional 6-part cron expression for recurring jobs |
| `taskPriority` | `TickerTaskPriority` | `Normal` | Execution priority (see [Enums](/api-reference/entities/enums#tickertaskpriority)) |
| `maxConcurrency` | `int` | `0` | Max concurrent executions. `0` = unlimited. When set, excess work is **queued** (not skipped) |

> **Note:** The source generator validates `[TickerFunction]` signatures at compile time. See [Diagnostics](./diagnostics) for details.

## [TickerQConstructor]

Namespace: `TickerQ.Utilities.Base`

Marks the preferred constructor to use for dependency injection when a class with `[TickerFunction]` methods has multiple constructors.

Rules:

- If exactly one constructor has `[TickerQConstructor]`, that constructor is used.
- If multiple constructors have `[TickerQConstructor]`, the generator emits an error (`TQ010`).
- If the class has multiple constructors and none are marked, the generator emits a warning (`TQ006`) and uses the first constructor.

See [Constructor Injection](/concepts/constructor-injection) for a conceptual overview.

## See Also

- [TickerFunctionContext](/api-reference/context) — The context object passed to every ticker function
- [Diagnostics](/api-reference/diagnostics) — Compile-time validation rules
- [Enums](/api-reference/entities/enums) — `TickerTaskPriority`, `TickerType`
- [Job Priorities](/concepts/job-priorities) — Priority behavior guide
- [Constructor Injection](/concepts/constructor-injection) — DI conceptual guide

