---
objective: "Lantern applies PbtA creation answers to their declared scalar or free-list destinations, then leaves only the resulting character value freely editable."
status: in-progress
---

# Plan: Issue #8 creation destinations

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Complete and prove the scalar and ListMany destination journeys specified by Lantern issue #8. |
| **Source** | [GitHub issue #8](https://github.com/RebelliousSmile/lantern/issues/8) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Preserve free editing after creation | [phase-1.md](./phase-1.md) |
| 2 | Assert both destination journeys | [phase-2.md](./phase-2.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern issue #8](https://github.com/RebelliousSmile/lantern/issues/8) | Scalar and bounded list answers persist stable values only, then remain freely editable. |
| [schema-pbta v5.1.0 release](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v5.1.0) | The published v5 playbook contract carries creation options, selection bounds, and optional destinations. |

## Decisions

| Decision | Why |
| --- | --- |
| Treat absent ListMany options as unrestricted. | The game definition has no persisted option catalogue to constrain an attribute populated from playbook editorial choices. |
| Reject empty ListMany option lists. | Only an absent catalogue selects free-list editing; the published codec rejects an explicit empty list. |
| Keep relationship catalogues in setup only. | They label creation offers but cannot become a persistent value restriction. |
| Reuse the existing string-list control. | A free destination needs no second Lantern collection editor. |
| Reuse the existing v5 contract and codecs. | The required document fields are already published; only Lantern’s runtime behavior and proof remain. |
