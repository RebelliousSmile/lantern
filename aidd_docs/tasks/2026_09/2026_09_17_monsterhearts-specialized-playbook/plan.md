---
objective: "Monsterhearts skins import, edit, persist, export as one valid TOML document, and render to PNG through a dedicated template without changing generic or Urban Shadows playbooks."
status: in-progress
---

# Plan: Specialized Monsterhearts playbook

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Add an original Monsterhearts skin editor and preview backed by the released specialized codec. |
| **Source** | [GitHub issue #5](https://github.com/RebelliousSmile/lantern/issues/5) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Monsterhearts template foundation | [`phase-1.md`](./phase-1.md) |
| 2 | Skin renderer and verification | [`phase-2.md`](./phase-2.md) |

## Resources

| Source | Verified |
| --- | --- |
| [schema-pbta v2.0.0 release](https://github.com/RebelliousSmile/schema-pbta/releases/tag/v2.0.0) | Publishes the immutable specialized Monsterhearts playbook codec. |
| [Monsterhearts codec schema](https://github.com/RebelliousSmile/schema-pbta/blob/v2.0.0/src/zod/monsterhearts-playbook.ts) | Adds strings, conditions, sex move, darkest self, backstory, advances and harm to the shared playbook shape. |

## Decisions

| Decision | Why |
| --- | --- |
| Use a separate `monsterhearts.playbook` template with `pbta/monsterhearts-playbook`. | The specialized contract is distinct and the generic renderer must remain unchanged. |
| Keep every skin field in the codec document. | The specialized contract defines a single TOML interchange boundary. |
| Use original content and a `.monsterhearts-doc` CSS scope. | Preview styles are global and external published playbook materials cannot be redistributed. |
