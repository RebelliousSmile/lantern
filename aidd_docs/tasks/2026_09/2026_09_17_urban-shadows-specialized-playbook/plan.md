---
objective: "Urban Shadows playbooks import, edit, persist, export as one valid TOML document, and render to PNG through a dedicated Lantern template without changing the generic PbtA playbook."
status: implemented
---

# Plan: Specialized Urban Shadows playbook

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Add a dedicated Urban Shadows playbook tab backed by the published specialized PbtA codec and an original, scoped sheet editor and preview. |
| **Source** | [GitHub issue #4](https://github.com/RebelliousSmile/lantern/issues/4) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Urban Shadows template foundation | [`phase-1.md`](./phase-1.md) |
| 2 | Specialized sheet experience and verification | [`phase-2.md`](./phase-2.md) |

## Resources

| Source | Verified |
| --- | --- |
| [schema-pbta v2.0.0 release](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v2.0.0) | The published dependency includes the Urban Shadows and Monsterhearts specialized single-TOML codecs. |
| [schema-pbta Urban Shadows codec schema](https://github.com/RebelliousSmile/schema-pbta/blob/v2.0.0/src/zod/urban-shadows-playbook.ts) | The specialized payload extends a PbtA playbook with statuses, mortal relationships, harm, scars, required corruption, and required end move. |

## Decisions

| Decision | Why |
| --- | --- |
| Add `urban-shadows.playbook` as a new game-specific module with contract key `pbta/urban-shadows-playbook`. | The published contract is specialized and the issue forbids modifying `pbta.playbook`. |
| Keep the document boundary exclusively in the published codec. | The codec validates and serializes one atomic TOML document; template view and editor selection remain workspace-only state. |
| Use an original scoped Urban Shadows visual system without external published assets or prose. | It satisfies the distribution constraint and keeps globally bundled preview CSS from affecting other open tabs. |
