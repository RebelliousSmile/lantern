---
objective: "Lantern automatically proves that every game pack shown by the launcher is backed by registered, contract-valid templates and that pack preferences preserve their documented behavior."
status: in-progress
---

# Plan: Game-pack assertions

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Add deterministic checks for registry-derived packs and game-pack preference persistence. |
| **Source** | User request following the pack-coverage assessment in this conversation. |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Make game-pack state testable and assert its persistence contract | [phase-1.md](./phase-1.md) |
| 2 | Assert pack-to-template-to-contract coverage | [phase-2.md](./phase-2.md) |

## Decisions

| Decision | Why |
| --- | --- |
| Extend the existing Node workspace harness rather than add a browser test runner. | The behaviors under review are deterministic store and registry invariants; the project already bundles this harness with esbuild. |
| Derive the test’s expected pack set from `templateRegistry`, never maintain a second hand-written pack list. | The registry is the application’s source of truth; a duplicate fixture would be able to drift in exactly the way the test is meant to detect. |
| Do not persist unfolded pack state across launches; persist only disabled-pack filters. | The launcher must begin with every pack collapsed so users deliberately choose what to inspect, while their pack-filter choices remain useful across sessions. |
