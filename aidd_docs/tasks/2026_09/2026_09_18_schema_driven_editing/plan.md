---
objective: "Lantern derives element and collection editing from declared document schemas, keeping every rendered datum traceable to the form that edits it."
status: implemented
---

# Plan: Schema-driven editing

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Replace section-only and JSON fallback editing with typed, schema-declared element and collection editors. |
| **Source** | Brainstorm in this conversation: schema → editor traceability, collection create/edit/delete, and conditional fields. |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Establish the editor-schema contract and generic renderer | [phase-1.md](./phase-1.md) |
| 2 | Make the generic PbtA playbook element-addressable | [phase-2.md](./phase-2.md) |
| 3 | Remove JSON fallbacks from specialized playbooks | [phase-3.md](./phase-3.md) |
| 4 | Migrate the remaining template families and prove the contract | [phase-4.md](./phase-4.md) |

## Decisions

| Decision | Why |
| --- | --- |
| Keep published Zod/TOML contracts authoritative for document validity, with a Lantern-owned declarative editor schema beside each template. | The installed schema packages validate interchange data but do not carry the UI labels, ordering, widget choices, element factories, or visibility rules needed to render an editor. |
| Use a descriptor id, a JSON-pointer-like document path, and an array-index locator in sheet targets; never persist editor-only ids in documents. | A preview click must open one exact editable datum rather than only a broad section, without changing the published TOML format; collection actions remain distinguishable from an element action. |
| Move generic collection operations into reusable primitives, not into the shared application shell. | Templates retain ownership of their document shapes, while matching list behavior and guardrails stop being copied across each form. |
| Make conditions presentation-only by default; a descriptor must explicitly opt into clearing a hidden value. | A temporary change to a controlling field must not silently destroy valid document data, while schema-specific cases can still declare pruning where that is required. |
