---
name: audit
description: Architecture audit report
---

# Codebase Audit: architecture

The documented template boundary is broadly followed, but the shell has one concrete template dependency and mounts its inspector twice.

- **Date**: 2026-09-18
- **Scope**: `src/` against `docs/codebase-architecture.md`
- **Health**: fair
- **Findings**: 0 critical, 3 warning, 0 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | architecture | `src/app/AppEditingView.tsx:49` | The mobile editor renders `TemplateInspector` while the desktop shell also always renders it at `src/app/AppDesktopInspector.tsx:37`. CSS only hides one instance; both forms mount, violating the documented single preview-to-editor flow and risking duplicate IDs and create effects. | Render a single inspector instance and adapt its container/presentation by breakpoint. | M |
| 🟡 | architecture | `src/core/workspace/store.ts:1` | The generic workspace layer imports the Legend in the Mist contract and a concrete `normalizeLegacyChallenge` template helper (`:4`). This reverses the documented dependency direction: templates should recover their own types while `core` remains generic. | Move the legacy migration behind a registered migration adapter or a template-owned bootstrap registration; then remove concrete template imports from the workspace store. | M |
| 🟡 | architecture | `src/templates/otherscape/challenge/editor/forms/ThreatsForm.tsx:55` | Two Otherscape templates own effectively the same threat editor, despite the documented per-game `shared/` boundary (`docs/codebase-architecture.md:89`). The duplicated component is an ungoverned cross-template boundary that will diverge. | Place the common editor in `src/templates/otherscape/shared/` with a narrow adapter interface for the Challenge and Power Set stores. | M |

## Top actions

1. Ensure exactly one `TemplateInspector` instance is mounted for an active tab (finding 1); hand off to `aidd-dev:08-debug`.
2. Decouple the legacy migration from `core/workspace` through a migration boundary (finding 2); hand off to `aidd-dev:07-refactor`.
3. Establish an Otherscape shared editor boundary for threats (finding 3); hand off to `aidd-dev:07-refactor`.

## Coverage

- **Scanned**: architecture — documented module boundaries, dependency direction, shared-template boundaries, and shell composition.
- **Skipped**: none.
