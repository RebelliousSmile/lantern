---
objective: "Lantern proves that its active lockfile and production Vite build adopt the exact schema-pbta candidate selected by the release train."
status: in-progress
---

# Plan: Prove schema-pbta candidate adoption

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Add a machine-readable Lantern adoption proof for an explicit schema-pbta archive and Lantern ref. |
| **Source** | [Lantern issue #20](https://github.com/RebelliousSmile/lantern/issues/20) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Build the candidate-adoption proof | [`phase-1.md`](./phase-1.md) |
| 2 | Wire the release-train invocation | [`phase-2.md`](./phase-2.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern #20](https://github.com/RebelliousSmile/lantern/issues/20) | Defines the candidate lockfile, Vite, appearance-resource and machine-readable proof requirements. |
| [schema-pbta #23](https://github.com/RebelliousSmile/schema-pbta/issues/23) | Defines the parent three-repository release train and its explicit-ref contract. |

## Decisions

| Decision | Why |
| --- | --- |
| Keep the daily pinned contract gate unchanged. | #20 is a release-candidate proof, not a replacement for existing immutable contract assertions. |
| Materialize only a pre-generated candidate lockfile with a frozen install. | An overlay or `--no-save` install can make package.json, npm and pnpm disagree; the lockfile is the only authoritative candidate resolution. |
| Verify both SHA-256 and SRI before any consumer proof. | SHA-256 identifies the release-train archive while SRI is the package-manager integrity recorded in each candidate lockfile. |
| Normalize the three direct schema archives in the Lantern adoption branch. | A clean frozen pnpm install resolves the real Lantern graph; signed URLs for PbtA, Mist or Adrenaline would otherwise expire before the proof. |
| Keep the central runner read-only. | It verifies the committed adoption ref and evidence; it never generates or mutates a consumer lockfile. |
