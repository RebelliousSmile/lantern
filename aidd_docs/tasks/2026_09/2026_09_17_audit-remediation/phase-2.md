---
status: pending
---

# Instruction: Specialized playbook editor cleanup

## Architecture projection

> Tree of the final files. ✅ create · ✏️ modify · ❌ delete

```txt
.
├── src/templates/monsterhearts/playbook/definition.tsx                 ✏️ format and split export/template helpers
├── src/templates/monsterhearts/playbook/editor/MonsterheartsPlaybookEditorPanel.tsx ✏️ route targets through readable forms and retain invalid drafts with feedback
├── src/templates/urban-shadows/playbook/editor/UrbanShadowsPlaybookEditorPanel.tsx ✏️ separate gating, target routing, and structured values
└── src/templates/shared/StructuredJsonEditor.tsx                       ✅ reusable local-draft JSON editor with parse feedback
```

## User Journey

```mermaid
flowchart TD
  A[Click specialized sheet region] --> B[Targeted editor]
  B --> C[Edit JSON draft]
  C --> D{Valid?}
  D -->|yes| E[Preview updates]
  D -->|no| F[Draft and inline parse feedback remain visible]
```

## Test Scope

```mermaid
---
title: Test scope
---
journey
  section Setup
    Open Monsterhearts or Urban Shadows example => a specialized region is selectable: 5: browser
  section Happy path
    Enter valid structured data => document and preview update: 5: browser
  section Edge case - invalid JSON
    Enter incomplete JSON => draft remains visible with parse feedback and document is unchanged: 5: browser
  section Teardown
    Select another region => the editor reflects its current persisted value: 5: browser
```

## Wireframe

```txt
┌──────────────────────────────┐
│ (1) Selected region label     │
├──────────────────────────────┤
│ (2) Structured draft editor   │
├──────────────────────────────┤
│ (3) Parse feedback            │
└──────────────────────────────┘
```

1. Region label identifies the current preview target.
2. Draft editor preserves user text until it can become document state.
3. Feedback explains why an invalid draft did not update the preview.

## Tasks to do

### `1)` Make structured editors reusable and explicit

> Eliminate duplicated parsing behavior without changing specialized document contracts.

1. Add a reusable local-draft editor with a parse error state and an `onValidValue` callback.
2. Refactor both specialized panels into target routing plus small identity and structured editor paths.
3. Reformat the Monsterhearts definition into named, testable helpers.

## Test acceptance criteria

| Task | Acceptance criteria |
| --- | --- |
| 1 | Invalid JSON is not persisted, remains visible, and names a parse error in both specialized editors. |
| 1 | Valid JSON updates only the selected specialized field and immediately re-renders its preview. |
| 1 | Both modules retain their existing codec keys, export actions, and game-definition handling. |
