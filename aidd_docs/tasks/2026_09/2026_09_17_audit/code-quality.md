---
name: audit
description: Code-quality audit report
argument-hint: N/A
---

# Codebase Audit: code-quality

The established template modules are generally cohesive, but the two newest specialized playbooks introduce dense one-line components and duplicated structured-editor behavior that will be costly to extend.

- **Date**: 2026-09-17
- **Scope**: `src/` and `tools/`
- **Health**: good
- **Findings**: 0 critical, 2 warning, 2 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | code-quality | `src/templates/monsterhearts/playbook/definition.tsx:12` | The entire template definition, export implementation, and error handling are encoded in one line, obscuring ownership and making edits error-prone. | Format and split the definition into named helpers, matching established template modules. | S |
| 🟡 | code-quality | `src/templates/urban-shadows/playbook/editor/UrbanShadowsPlaybookEditorPanel.tsx:7` | The component mixes game-definition gating, form routing, JSON serialization, parsing, and mutable UI concerns in one dense expression. | Extract the structured-value editor and use a target-to-form map. | M |
| 🟢 | code-quality | `src/templates/monsterhearts/playbook/editor/MonsterheartsPlaybookEditorPanel.tsx:5` | Invalid JSON is silently retained via a no-op catch; users receive no error and the implementation is difficult to read. | Surface parse feedback locally while preserving the text being edited. | S |
| 🟢 | code-quality | `src/templates/legend-in-the-mist/challenge/editor/forms/ThreatsForm.tsx:1` | The form is 1,001 lines, well beyond the project’s component granularity elsewhere. | Split by threat subsection and shared list primitives. | L |

## Top actions

1. Format and decompose the Monsterhearts and Urban Shadows specialized playbook modules (findings 1–3); hand off to `aidd-dev:07-refactor`.
2. Split the oversized Threats form around its independently editable sections (finding 4); hand off to `aidd-dev:07-refactor`.
3. Add visible parse feedback to structured editors while keeping invalid drafts editable (finding 3); hand off to `aidd-dev:08-debug` or `aidd-dev:07-refactor`.

## Coverage

- **Scanned**: code-quality
- **Skipped**: none
