# Diagnostics (Source Generator)

TickerQ ships a Roslyn source generator that validates your `[TickerFunction]` classes and methods. When something is misconfigured, it reports diagnostics in your IDE/build output.

This page lists the diagnostics IDs and what they mean.

## TQ001 – ClassAccessibility

> **Class accessibility issue**  
> The class '{0}' should be public or internal to be used with [TickerFunction]

Make the class containing `[TickerFunction]` methods `public` or `internal`.

## TQ002 – MethodAccessibility

> **Method accessibility issue**  
> The method '{0}' should be public or internal to be used with [TickerFunction]

Make the method with `[TickerFunction]` `public` or `internal`.

## TQ003 – InvalidCronExpression

> **Invalid cron expression**  
> The cron expression '{0}' in function '{1}' is invalid

Fix the `cronExpression` argument on `[TickerFunction]` to a valid 6-part expression.

## TQ004 – MissingFunctionName

> **Missing function name**  
> The [TickerFunction] attribute on method '{0}' in class '{1}' must specify a function name

Always provide a `functionName` in `[TickerFunction("Name", ...)]`.

## TQ005 – DuplicateFunctionName

> **Duplicate function name**  
> The function name '{0}' is already used by another [TickerFunction] method

Ensure each `[TickerFunction]` has a unique `functionName` across your assembly.

## TQ006 – MultipleConstructors

> **Multiple constructors detected**  
> The class '{0}' has multiple constructors. Only the first constructor will be used for dependency injection. Consider using [TickerQConstructor] attribute to explicitly mark the preferred constructor.

Add `[TickerQConstructor]` to the constructor you want TickerQ to use, or reduce to a single constructor.

## TQ007 – AbstractClass

> **Abstract class with TickerFunction**  
> The abstract class '{0}' contains [TickerFunction] methods

Move `[TickerFunction]` methods to a non-abstract class that can be instantiated.

## TQ008 – NestedClass

> **Nested class with TickerFunction**  
> The nested class '{0}' contains [TickerFunction] methods. TickerFunction methods are only allowed in top-level classes.

Move job handler classes to top level; nested classes are not supported for `[TickerFunction]`.

## TQ009 – InvalidMethodParameter

> **Invalid TickerFunction parameter**  
> The method '{0}' has invalid parameter '{1}' of type '{2}'. TickerFunction methods can only have TickerFunctionContext, TickerFunctionContext&lt;T&gt;, CancellationToken parameters, or no parameters.

Update the method signature so it only uses allowed parameter types:

- `TickerFunctionContext`
- `TickerFunctionContext&lt;T&gt;`
- `CancellationToken`

## TQ010 – MultipleTickerQConstructorAttributes

> **Multiple TickerQConstructor attributes**  
> The class '{0}' has multiple constructors with [TickerQConstructor] attribute. Only one constructor can be marked with [TickerQConstructor].

Remove extra `[TickerQConstructor]` attributes so at most one constructor is marked.

## TQ011 – InvalidMaxConcurrency

> **Invalid maxConcurrency value**
> The maxConcurrency value for function '{0}' must be >= 0 (0 = unlimited)

The `maxConcurrency` parameter on `[TickerFunction]` must be zero or positive. `0` means unlimited concurrency (default). Negative values are not allowed.

## See Also

- [Attributes](/api-reference/attributes) — `[TickerFunction]` and `[TickerQConstructor]` reference
- [TickerFunctionContext](/api-reference/context) — Valid method parameter types
- [Job Fundamentals](/concepts/job-fundamentals) — How ticker functions work
