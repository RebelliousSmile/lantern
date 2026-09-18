---
objective: "A linked PbtA creation answer initializes only a matching Text or LongText destination, persists no setup state, and remains freely editable."
status: implemented
---

# Plan: PbtA creation text destinations

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Complete the v5 creation flow with a valid paired sample and an explicit metadata round-trip assertion. |
| **Source** | [GitHub issue #7](https://github.com/RebelliousSmile/lantern/issues/7) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Apply linked text destinations in the creation flow | [phase-1.md](./phase-1.md) |
| 2 | Assert linked creation metadata round trips | [phase-2.md](./phase-2.md) |

## Resources

| Source | Verified |
| --- | --- |
| [schema-pbta v5.0.0](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v5.0.0) | A creation question may name an optional attribute destination, while option catalogues remain playbook editorial data. |

## Decisions

| Decision | Why |
| --- | --- |
| Keep selection state component-local. | Only the resulting text value belongs in the persisted playbook character state. |
| Reject invalid destinations in the UI. | A target must exist in the open game definition and be Text or LongText; silent no-ops hide contract errors. |
| Keep paired samples contractually coherent. | The sample playbook and game definition use the same game id, so an example destination must be defined by that game. |
