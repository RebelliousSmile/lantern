---
name: audit
description: Architecture audit report
argument-hint: N/A
---

# Codebase Audit: architecture

The template-registry and workspace boundaries are largely followed, but the documented architecture has fallen behind the supported games and the core workspace retains a template-specific migration dependency.

- **Date**: 2026-09-17
- **Scope**: `src/` and `docs/codebase-architecture.md`
- **Health**: good
- **Findings**: 0 critical, 2 warning, 0 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | architecture | `docs/codebase-architecture.md:25` | The documented template path names only City of Mist, Legend in the Mist, and Otherscape, while actual registered modules include Adrenaline, PbtA, Urban Shadows, and Monsterhearts. | Update the architecture and template-adding documentation to describe arbitrary game IDs and the current game set. | S |
| 🟡 | architecture | `src/core/workspace/store.ts:4` | The generic workspace store imports `toLegendInTheMistChallengeDocument` from a specific template, contradicting the documented generic-store/template-boundary rule. | Move legacy migration normalization behind a migration adapter or isolate it in the legacy template module. | M |

## Top actions

1. Remove the template-specific import from the generic workspace layer (finding 2); hand off to `aidd-dev:07-refactor`.
2. Refresh architecture documentation so it matches the registry-derived game model (finding 1); hand off to `aidd-dev:07-refactor`.
3. Re-audit architecture after the migration boundary is isolated (finding 2); hand off to `aidd-dev:04-audit architecture`.

## Coverage

- **Scanned**: architecture
- **Skipped**: none
