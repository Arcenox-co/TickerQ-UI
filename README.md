# TickerQ website and documentation

The Next.js / Fumadocs application for [tickerq.net](https://tickerq.net).

## Documentation versions

| Line | Source | URL |
| --- | --- | --- |
| **5.x · Commercial** | `content/docs-5x` | `/docs/5.x` |
| **Legacy · Open-source releases** | `content/docs` | `/docs` |

5.x is the functional line shared by `10.5.x`, `9.5.x`, and `8.5.x` NuGet packages. Community, Evaluation, and paid subscriptions share its technical docs. Package availability and preview status remain release-specific.

Keep legacy files and URLs intact. Add commercial pages to `content/docs-5x` and its `meta.json` navigation. Commercial navigation begins with **Guide**, **What is TickerQ?**, and **Changelog**, followed by one task-oriented tree: Getting started, Jobs and workflows, Storage, Dashboard, Operations, and Integrations. The `(jobs)`, `(storage)`, and `(operations)` folders contain navigation metadata referencing existing pages; they do not move those pages or change their URLs. Keep every commercial page reachable exactly once. Links between commercial guides should stay under `/docs/5.x`. A version switch preserves the page when the other version has the same path, otherwise it opens that version's introduction.

Search and Ask AI use separate indexes for each version. The AI conversation resets on a version switch. Invalid version selectors are rejected by the APIs. Markdown exports, social images, canonical URLs, and the sitemap include both lines.

| Machine-readable endpoint | Content |
| --- | --- |
| `/llms.txt` | Version directory and legacy index |
| `/llms-full.txt` | Legacy full text (existing endpoint) |
| `/llms-5x.txt` | Commercial 5.x index |
| `/llms-5x-full.txt` | Commercial 5.x full text |
| `/docs/5.x/PAGE.mdx` | Markdown for a commercial page |

The initial commercial guides were checked against TickerQ `main-commercial` commit `000145760f7b59aba6814b83501fcc41a3731618`. Detailed runtime, storage, and integrations references were adapted from that checkout; keep them aligned when APIs change. Do not label an unreleased or preview package as a stable release.

## Changelog and release notes

The [5.x changelog](https://tickerq.net/docs/5.x/changelog) reads published releases from [Arcenox-co/TickerQ on GitHub](https://github.com/Arcenox-co/TickerQ/releases). GitHub Releases is the source of truth: write and edit the notes there, rather than maintaining a second copy in this repository. The page is linked beside Guide and What is TickerQ? in the commercial sidebar and from the site's main navigation.

The feed accepts tags in the `8.5.<patch>`, `9.5.<patch>`, and `10.5.<patch>` package lines, with an optional `v` prefix and prerelease suffix. Draft releases do not appear. Use GitHub's prerelease setting for previews; do not label a beta as stable. Only list package versions that have actually been published. A release for one .NET target does not establish that corresponding packages for the other targets are available.

To prepare a release:

1. Create a **draft** GitHub Release for the intended tag. Start with the [release notes template](docs/release-notes-template.md), then describe the changes customers will notice. Generated pull-request summaries can help prepare the draft, but review their accuracy and remove internal-only details.
2. Include relevant new features, improvements, fixes, breaking changes, and upgrade steps. Specify required database migrations, configuration changes, and any action customers must take before deploying.
3. Publish the release when it is ready. Publishing a release triggers the library's existing build, publication, and version-branch synchronization workflows. Check those workflows and verify the resulting NuGet packages; the GitHub release alone does not prove publication succeeded.
4. Update the published notes with the exact available package versions and any corrections. Do not add anticipated releases or companion versions that have not shipped.

The server caches the release feed and revalidates it hourly when traffic reaches the page. New releases and edits to existing notes therefore appear without a docs deployment after cache refresh; publication is not an immediate push to every visitor. If GitHub cannot be reached, the page provides a direct link to the releases. Legacy release documentation remains at `/docs/releases`.

## Local development

```sh
bun install --frozen-lockfile
bun run dev
```

Open [localhost:3000/docs/5.x](http://localhost:3000/docs/5.x). Search and documentation rendering work without AI credentials. Ask AI needs `OPENAI_API_KEY`; `OPENAI_MODEL` optionally selects the model. Keep secrets in untracked local environment configuration.

## Validation

```sh
bun test
bun run types:check
bun run lint
bun run build
```

The documentation tests cover version boundaries, navigation fallback, the six commercial navigation groups, full sidebar page coverage, and local page links. Check both documentation lines, search, the version selector, and the mobile sidebar when changing layouts.

With a local server running, `bun run test:docs` checks every documentation page, canonical URLs, search isolation, rendered link anchors, screenshot assets, navigation coverage, Markdown exports, social images, and invalid version requests. Set `DOCS_TEST_URL` if the server uses a port other than 3000.

Pushes to `main` trigger the repository's deployment workflow; it can also be run manually on `main`. Review changes on a branch before merging.

The workflow builds an image tagged with the commit SHA and `latest`, then calls the existing deployment webhook over HTTPS on port 443. The origin uses a Cloudflare Origin certificate, so the request authenticates its exact public key using curl's `--pinnedpubkey`. Keep the verified pin in sync when the server certificate key changes; never remove the pin or switch back to plaintext port 9000. `DEPLOY_TOKEN` stays in GitHub Actions secrets.

The webhook starts deployment asynchronously. `/api/health` returns the running container's `APP_REVISION` with caching disabled, and the workflow waits until it matches the commit being deployed. A successful webhook request alone does not count as a successful deployment. If verification fails, inspect the docs container and deployment service logs before retrying. Local builds without an explicit revision report `unknown`.

The Docker context excludes local dependencies, generated output, and environment files. Configure production secrets on the server rather than putting them in the image.

## Dashboard screenshots

The 5.x dashboard tour and homepage use JPEG captures in `public/images/dashboard/`. These were captured from the local running 5.x demo hosts on 19 October 2026: chains (5221), persisted logs (5220), integrations (5272), and simulated diagnostics (5230). The screenshot counts and timings are demo activity, not benchmark results.

Use a 1440 × 920 browser viewport when refreshing these assets. Navigate the real demo UI; do not send test integrations or change saved settings just to take screenshots. Use anonymized workspace labels and hide certificate identifiers before capture. Keep webhook URLs, tokens, and certificate contents out of images. The assistant capture shows a real demo conversation and a pending one-time job proposal. Confirm was not clicked, and no job was created for this capture. Replies and proposed details vary with the configured model and request.

`DashboardScreenshot` supplies descriptive alt text, captions, and a link to each full-size image. Keep the visual tour and related guide screenshots in sync when dashboard screens change. Homepage previews are navigable with the keyboard and link to the full tour.


## Keeping commercial documentation accurate

See the [page-by-page review](docs/reviews/2026-10-19.md) for the initial 38-page audit and subsequent additions, source references, validation results, and remaining library concerns.

The 19 October 2026 review compared the 5.x pages with `TickerQ` main-commercial commit `000145760f7b59aba6814b83501fcc41a3731618`, including public manager interfaces, registration builders, scheduler defaults, result/request APIs, dashboard auth, EF staging/history, and integration contracts. It corrected the legacy-adoption signature and authentication scheme descriptions and added registration, request/result, scheduler, manager, and troubleshooting guides.

The authentication follow-up verified database-backed host users, role/claim/scope mappings, middleware order, runtime configuration, API write guards, integration management, and SignalR connection checks. The dashboard guides distinguish these supported controls from per-job or per-tenant permissions, which are not built in.

For future changes:

- Verify signatures against source, not only another README. State whether an example is a complete application or extends an existing registration.
- Distinguish host-local controls from persisted/cluster behavior, accepted operations from completed jobs, and optional capabilities from defaults.
- Keep advanced rollout details in the storage/reliability references and link them from task-oriented guides.
- Compile new C# examples against the matching source/package line. A documentation build checks MDX, not C# APIs or runtime behavior.
- Run content and route checks, and inspect navigation on desktop and mobile. Keep screenshots descriptive and anonymized.
