---
objective: "All template view hooks use one typed visibility protocol without changing their persisted view semantics."
status: implemented
---

# Plan: Extract the shared visibility protocol

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Replace duplicated `hidden` merge, toggle and set operations with one typed helper. |
| **Source** | [Lantern issue #16](https://github.com/RebelliousSmile/lantern/issues/16) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Specify and test the protocol | [`phase-1.md`](./phase-1.md) |
| 2 | Migrate template hooks | [`phase-2.md`](./phase-2.md) |
| 3 | Prove registry-wide conformance | [`phase-3.md`](./phase-3.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern #16](https://github.com/RebelliousSmile/lantern/issues/16) | Requires a shared implementation, documented divergence and green contract assertions. |

## Decisions

| Decision | Why |
| --- | --- |
| Parameterize only immutable defaults and the existing view patch callback. | Each template retains its document and view ownership while `hidden` mutations become identical. |
| Migrate all 18 observed consumers, not the stale count of 15. | The codebase contains 18 hooks with the protocol; excluding three would preserve the reported defect. |
