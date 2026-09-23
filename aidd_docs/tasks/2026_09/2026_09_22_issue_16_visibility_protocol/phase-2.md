---
status: done
---

# Instruction: Migrate template hooks

## Architecture projection

```txt
src/templates/{city-of-mist,otherscape,legend-in-the-mist,pbta,urban-shadows,monsterhearts}/**/hooks.ts  ✏️ consume shared visibility operations
src/templates/adrenaline/shared/hooks.ts                                                               ✏️ document exclusion: no hidden view protocol
```

## User Journey

```mermaid
flowchart TD
  A[Existing hook] --> B[Shared hidden operations]
  B --> C[Existing template patch callback]
  C --> D[Persisted view unchanged in shape]
```

## Test Scope

```mermaid
journey
  section Setup
    Load each template's default and persisted view => visibility state is ready: 5: cli
  section Happy path
    Use every template visibility control => the same persisted hidden map is written: 5: cli
  section Edge case - deliberate exclusion
    Inspect Adrenaline hook => exclusion and reason are documented: 5: cli
  section Edge case - absent tab
    Invoke a migrated view hook without an active tab => no workspace patch occurs: 5: cli
```

## Tasks to do

### `1)` Replace duplicated protocol bodies

1. Migrate all 18 hooks found to the helper without changing public hook APIs.
2. Keep template-specific reset and view fields local; preserve each hook's existing no-active-tab behavior.
3. Document the Adrenaline exclusion beside its hook.

## Test acceptance criteria

| Task | Acceptance criteria |
| --- | --- |
| 1 | No migrated hook duplicates hidden merge, toggle or set logic. |
