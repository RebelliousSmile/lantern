---
objective: "The Apocalypse World pack exposes Salvage Run as a document game, and PbtA creation questions initialize schema-defined scalar or ListMany destinations without constraining later edits."
status: implemented
---

# Plan: Apocalypse World creation destinations

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Clarify the Apocalypse World pack and complete schema-defined creation destinations for single text and multiple-list answers, including Urban Shadows. |
| **Source** | [GitHub issue #8](https://github.com/RebelliousSmile/lantern/issues/8) and the clarified pack taxonomy. |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Clarify the Apocalypse World pack identity | [phase-1.md](./phase-1.md) |
| 2 | Apply scalar and ListMany creation destinations | [phase-2.md](./phase-2.md) |
| 3 | Render Urban Shadows relationship creation | [phase-3.md](./phase-3.md) |

## Resources

| Source | Verified |
| --- | --- |
| [schema-pbta v5.0.0](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v5.0.0) | Creation options retain editorial labels while selected stable values initialize an optional editable destination. |
| [schema-pbta#7](https://github.com/RebelliousSmile/schema-pbta/issues/7) | Required before the Urban Shadows implementation: its release must supply the ListMany attribute, three-key relationship catalogue, creation bounds, and canonical witness. |

## Decisions

| Decision | Why |
| --- | --- |
| Separate launcher-pack identity from document game identity. | `apocalypse-world` names the sidebar pack; `salvage-run` remains the `game` value that links a playbook to its definition. |
| Validate destination type from the matching open game definition. | Text/LongText is valid for one selection, while ListMany is valid for multiple selections; no consumer-local attribute semantics are invented. |
| Keep relationship catalogues editorial. | Urban Shadows keys are persisted in `attributes`; their labels and descriptions remain in the playbook’s `mortalRelationships` catalogue. |
| Wait for schema-owned Urban Shadows semantics. | Lantern may consume a published definition and corpus witness but must not invent game attribute keys, option bounds, or relationship rules. |
