---
objective: "Lantern opens, edits, previews, persists, exports, and round-trips every schema-pbta v4 specialized playbook as its own canonical TOML target while preserving generic PbtA workflows."
status: in-progress
---

# Plan: schema-pbta v4 specialized playbooks

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Consume the published v4 PbtA contract and ship five canonical specialized playbooks without making generic `playbook` a second canonical sheet. |
| **Source** | [GitHub issue #5](https://github.com/RebelliousSmile/lantern/issues/5) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Adopt the published v4 contract and conformance corpus | [`phase-1.md`](./phase-1.md) |
| 2 | Migrate the existing Monsterhearts and Urban Shadows canonical sheets | [`phase-2.md`](./phase-2.md) |
| 3 | Add Masks, Monster of the Week, and The Sprawl canonical sheets | [`phase-3.md`](./phase-3.md) |
| 4 | Prove canonical routing, round trips, and generic-workflow compatibility | [`phase-4.md`](./phase-4.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Issue #5](https://github.com/RebelliousSmile/lantern/issues/5) | Scope, the five canonical targets, and the requirement to preserve generic PbtA workflows. |
| [schema-pbta v4.0.0 release](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v4.0.0) | The immutable archive, SHA-256 digest, exported codecs, and v4 corpus are available for consumption. |

## Decisions

| Decision | Why |
| --- | --- |
| Treat the v4 package export map and its shipped corpus as the only source of specialized document shape and fixtures. | Lantern must consume, not redefine, the external immutable contract. |
| Keep `pbta/playbook` as the existing generic interchange workflow, but never route a specialized target through it. | This reconciles canonical specialized documents with the issue’s compatibility requirement. |
| Give each canonical target a dedicated template boundary rather than a game-name branch in the generic sheet. | Game-specific mechanics and editorial regions must remain present in edit and preview surfaces. |
