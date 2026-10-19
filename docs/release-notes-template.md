# GitHub Release notes template

Use this as an authoring aid for a draft release in [Arcenox-co/TickerQ](https://github.com/Arcenox-co/TickerQ/releases). This file is not a published release or a changelog entry. Replace the placeholders, remove unused sections, and keep the completed notes on GitHub only.

Set the exact package tag in GitHub and use its prerelease setting for a preview. The changelog takes the release date and prerelease status from GitHub. Publishing triggers the library's release workflows, so prepare and review the notes as a draft first.

Keep descriptions focused on customer-visible behavior. For a fix, explain the trigger and the corrected behavior. For an upgrade requirement, state what customers must do and when. Do not claim a package is available until its publication is verified.

---

## Summary

_One or two sentences explaining the main changes and who benefits._

## New features

- _Feature and what customers can now do. Link to the relevant 5.x guide._

## Improvements

- _Existing behavior that changed and its practical benefit._

## Fixes

- _The circumstances that caused a problem and the corrected behavior._

## Breaking changes

- _Affected API, configuration, storage schema, or behavior; the required replacement; and who must act._

## Upgrading

_Describe any prerequisites, database migration steps, deployment ordering, configuration changes, or code updates. Link to the applicable migration or upgrade guide. If no action beyond the package upgrade is required, say so only after verification._

## Published packages

_After the publication workflow succeeds, list only the exact package IDs and versions verified on NuGet. Do not infer that all .NET target lines shipped together. Remove this section from the published notes until availability is verified._

| Package | Published version | .NET target |
| --- | --- | --- |
| _package ID_ | _exact published version_ | _target_ |

## Known limitations

_Include only limitations relevant to this release, with a workaround or tracking link where available._
