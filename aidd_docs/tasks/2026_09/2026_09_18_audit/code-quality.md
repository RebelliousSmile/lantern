---
name: audit
description: Code quality audit report
---

# Codebase Audit: code quality

The project builds and lints cleanly, but repeated template mechanics make equivalent fixes costly and fragile.

- **Date**: 2026-09-18
- **Scope**: `src/` and `tools/`
- **Health**: fair
- **Findings**: 0 critical, 2 warning, 1 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | code-quality | `src/templates/otherscape/challenge/editor/forms/ThreatsForm.tsx:55` | This 811-line editor is a near-identical copy of the Power Set editor (`src/templates/otherscape/power-set/editor/forms/ThreatsForm.tsx:55`); the differences are store and noun substitutions. Behavioural fixes to drag, edit, and consequence flows must be applied twice. | Extract a parameterised Otherscape shared threat editor, leaving each template to bind its document-specific store and labels. | M |
| 🟡 | code-quality | `src/templates/otherscape/challenge/hooks.ts:47` | The same JSON/`structuredClone` fallback is reimplemented in the workspace store and 31 template definition/hook files, so its semantics and any bug fix can drift by template. | Export one cross-cutting clone helper and migrate the duplicate implementations incrementally. | M |
| 🟢 | code-quality | `src/core/workspace/store.ts:378` | `persistWorkspace` is declared in `WorkspaceState` and implemented, but has no caller; every normal mutation already persists through `setAndPersist`. It enlarges the public store API without a live responsibility. | Remove the unused action and its type entry, or add a documented caller if an explicit persistence boundary is intended. | S |

## Top actions

1. Extract the shared Otherscape threat editor (finding 1); hand off to `aidd-dev:07-refactor`.
2. Consolidate cloning behind one helper and retain the current browser fallback semantics (finding 2); hand off to `aidd-dev:07-refactor`.
3. Remove or justify the unused workspace persistence action (finding 3); hand off to `aidd-dev:07-refactor`.

## Coverage

- **Scanned**: code-quality — full `src/` and `tools/` scan, including lint-suppression, unsafe-type, size, duplicate-pattern, and unused-symbol searches.
- **Skipped**: none.
