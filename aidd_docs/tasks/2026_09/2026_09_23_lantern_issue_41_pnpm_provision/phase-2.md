---
status: pending
---

# Instruction: Global-pnpm regression proof

## Architecture projection

```txt
tools/
├── release-train-assert.mjs ✏️ export the frozen-install command helper for test coverage
└── release-train-protocol.harness.mjs ✏️ assert deterministic command construction without invoking pnpm
```

## User Journey

```mermaid
flowchart TD
  A[Harness starts without global pnpm] --> B[Inspect assertion command construction]
  B --> C[Provisioned pnpm 10 command is selected]
  C --> D[Regression passes]
```

## Test Scope

```mermaid
journey
  section Happy path
    harness exercises the isolated install path => provisioned pnpm command and preserved frozen flags are observed: 5: cli
```

## Tasks to do

### `1)` Cover package-manager provisioning

> Make the regression fail if a future change returns to a bare `pnpm` command.

1. Import the exported command helper into the existing Node-only protocol harness.
2. Assert the selected executable and arguments include `npx --yes pnpm@10` plus the existing frozen-install protections.
3. Assert a supplied temporary-store path is passed through unchanged.

## Test acceptance criteria

| Task | Acceptance criteria |
| --- | --- |
| 1 | The harness fails if the assertion depends on a global `pnpm` executable. |
| 1 | The regression confirms `--frozen-lockfile`, `--ignore-scripts`, and the isolated store remain in the command. |
