---
objective: "Lantern consumes schema-pbta v5 and applies its complete breaking playbook contract: acquisitions, creation destinations, and stat profiles all initialize editable character state without retaining editorial setup data."
status: in-progress
---

# Plan: schema-pbta v5 playbook migration

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Upgrade every affected Lantern playbook surface for the v5 acquisition, creation-destination, and stat-profile contract. |
| **Source** | [Issues #6](https://github.com/RebelliousSmile/lantern/issues/6), [#7](https://github.com/RebelliousSmile/lantern/issues/7), [#8](https://github.com/RebelliousSmile/lantern/issues/8), and [#9](https://github.com/RebelliousSmile/lantern/issues/9) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Adopt the released v5 contract and preserve all document data | [phase-1.md](./phase-1.md) |
| 2 | Run generic playbook character creation | [phase-2.md](./phase-2.md) |
| 3 | Render acquisitions across generic and specialized playbooks | [phase-3.md](./phase-3.md) |

## Resources

| Source | Verified |
| --- | --- |
| [schema-pbta v5 checkmark plan](https://github.com/RebelliousSmile/schema-pbta/tree/d8afc3cbcc4029a90b3e910eea2debb1057d18d8/aidd_docs/tasks/2026_09/2026_09_17_playbook_checkmarks) | `checked` is optional, applies only to carried playbook moves and structured advancement entries, and invalid non-boolean values are rejected by the schema. |
| [schema-pbta v5.0.0 release](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v5.0.0) | Published on 2026-09-18 with the immutable package tarball and SHA-256 asset required by phase 1. |

## Decisions

| Decision | Why |
| --- | --- |
| Treat the v5 release asset as a hard prerequisite. | Lantern must consume an immutable published schema package and must not reproduce its semantics locally. |
| Preserve absent `checked` rather than materialising `false`. | The contract defines absence as unchecked and keeping it absent preserves older TOML documents’ canonical shape. |
| Keep creation choices as transient UI state. | Selecting a choice copies only its stable value to the linked editable attribute or stat map; neither the option catalogue nor unselected profiles become character state. |
| Apply checkboxes to carried moves and every v5 advancement-entry location. | This covers generic `advancement`, Monsterhearts `advances`, and Urban Shadows `corruption.advances`, never standalone moves or `choiceSets`. |
