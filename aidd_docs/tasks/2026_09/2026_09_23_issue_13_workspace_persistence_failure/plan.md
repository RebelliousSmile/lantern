---
objective: "A failed local workspace save is visible, marks the workspace unsaved, and offers an immediate rescue export."
status: implemented
---

# Plan: Surface workspace persistence failures

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Replace silent localStorage failure with durable UI recovery. |
| **Source** | [Lantern issue #13](https://github.com/RebelliousSmile/lantern/issues/13) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Expose persistence state | [`phase-1.md`](./phase-1.md) |
| 2 | Add rescue UI and export | [`phase-2.md`](./phase-2.md) |
| 3 | Assert storage-failure recovery | [`phase-3.md`](./phase-3.md) |

## Decisions

| Decision | Why |
| --- | --- |
| Keep the snapshot in memory after a failed write. | The current session remains recoverable even when persistence is unavailable. |
| Export the complete workspace JSON. | Per-template TOML cannot rescue tabs, order or UI state. |
| Clear the failure on the next successful write. | A transient storage error must not leave a stale data-loss warning. |
