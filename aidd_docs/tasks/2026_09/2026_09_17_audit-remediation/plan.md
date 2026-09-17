---
objective: "Resolve every code-quality and architecture finding in the 2026-09-17 audit while preserving template behavior and contract interoperability."
status: implemented
---

# Plan: Audit remediation

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Remove the template-specific workspace dependency, align documentation, and make audited template editors maintainable and observable. |
| **Source** | `aidd_docs/tasks/2026_09/2026_09_17_audit/code-quality.md` and `architecture.md` |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Generic workspace migration and documentation | [`phase-1.md`](./phase-1.md) |
| 2 | Specialized playbook editor cleanup | [`phase-2.md`](./phase-2.md) |
| 3 | Challenge threats editor decomposition | [`phase-3.md`](./phase-3.md) |

## Decisions

| Decision | Why |
| --- | --- |
| Move legacy normalization behind a core-owned migration adapter. | The workspace store must not import a template model. |
| Keep incomplete JSON drafts local and show parse feedback. | A form must not discard user input, but silent failure hides the reason no update occurred. |
| Split the large threats form by independently editable panel concerns. | It preserves existing routes and DnD behavior while shrinking the component’s responsibility. |
