---
objective: "Lantern release-train assertions perform their isolated frozen install with a provisioned pnpm version and prove that no global pnpm binary is required."
status: in-progress
---

# Plan: Provision pnpm for Lantern release-train assertions

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Make the consumer-owned frozen installation reproducible on GitHub Actions, then rerun exactly one schema-pbta train after the Lantern fix merges. |
| **Source** | [RebelliousSmile/lantern#41](https://github.com/RebelliousSmile/lantern/issues/41) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Deterministic isolated installation | [phase-1.md](./phase-1.md) |
| 2 | Global-pnpm regression proof | [phase-2.md](./phase-2.md) |

## Decisions

| Decision | Why |
| --- | --- |
| Provision the same pinned pnpm major through `npx --yes pnpm@10` inside Lantern. | The consumer proof remains self-contained and matches the orchestrator's supported installation path. |
| Test command construction without running an install. | The regression can prove the absence of a global-pnpm dependency without downloading the candidate or relying on PATH. |
