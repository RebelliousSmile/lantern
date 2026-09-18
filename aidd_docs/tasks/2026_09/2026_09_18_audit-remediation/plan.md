---
objective: "Resolve every code-quality and architecture finding in the 2026-09-18 audit while preserving existing template behavior and contract interoperability."
status: in-progress
---

# Plan: Audit remediation

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Restore the documented workspace and template boundaries, then remove the highest-cost duplicated implementation paths. |
| **Source** | `aidd_docs/tasks/2026_09/2026_09_18_audit/code-quality.md` and `aidd_docs/tasks/2026_09/2026_09_18_audit/architecture.md` |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Restore workspace and inspector boundaries | [`phase-1.md`](./phase-1.md) |
| 2 | Centralize defensive cloning | [`phase-2.md`](./phase-2.md) |
| 3 | Share the Otherscape threats editor | [`phase-3.md`](./phase-3.md) |

## Decisions

| Decision | Why |
| --- | --- |
| Register legacy workspace migrations as optional template-contract descriptors. | The store can discover a storage key, template identity, parser, and normalizer through the existing registry without importing a concrete game contract. |
| Preserve the current cloning fallback semantics. | `structuredClone` is not guaranteed in every supported browser context, and workspace writes must continue to defend stored documents from mutation. |
| Share the threat editor through a narrow adapter, not through either template store. | Challenge and Power Set retain ownership of their document shapes while their common editing workflow has one implementation. |
