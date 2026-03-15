# Releases

Track new features, improvements, and bug fixes across TickerQ versions.

TickerQ follows [Semantic Versioning](https://semver.org/). Each major version targets a specific .NET runtime:

| Version Track | .NET Target | Status |
|--------------|-------------|--------|
| **10.x** | .NET 10 | Active |
| **9.x** | .NET 9 | Active |
| **8.x** | .NET 8 (LTS) | Active |

::: tip Version Parity
All three version tracks receive the same features and fixes simultaneously. Choose the track that matches your .NET runtime.
:::

## Latest Releases

### [v10.2.0](./v10.2.0) / [v9.2.0](./v9.2.0) / [v8.2.0](./v8.2.0)
Per-function concurrency control, dashboard timezone-aware date formatting, Redis disabled ticker filtering, and more.

## Upgrade Guide

Upgrading within the same major version (e.g., 10.1.x to 10.2.x) requires no breaking changes. Simply update the NuGet packages:

```bash
dotnet add package TickerQ --version 10.2.0
```

For cross-major upgrades (e.g., 8.x to 10.x), update your target framework and review any .NET runtime-specific changes.
