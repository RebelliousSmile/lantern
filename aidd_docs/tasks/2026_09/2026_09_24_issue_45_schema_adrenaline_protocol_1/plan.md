---
objective: "Lantern accepts and proves a strict protocol-1 schema-adrenaline candidate while preserving the existing schema-pbta release-train path and forbidding local fallbacks."
status: in-progress
---

# Plan: Accept schema-adrenaline protocol-1 candidates

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Generalize Lantern's release-train parser and proof dispatcher, then adopt and verify the published Adrenaline 2.5.0 candidate in both lockfiles. |
| **Source** | [RebelliousSmile/lantern#45](https://github.com/RebelliousSmile/lantern/issues/45) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Strict provider-aware protocol | [`phase-1.md`](./phase-1.md) |
| 2 | Provider-specific proof dispatch | [`phase-2.md`](./phase-2.md) |
| 3 | Published candidate adoption | [`phase-3.md`](./phase-3.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern #45](https://github.com/RebelliousSmile/lantern/issues/45) | Defines the Lantern parser, dispatcher, dual-lockfile, SHA, installation, and full-commit acceptance requirements. |
| [schema-pbta #40](https://github.com/RebelliousSmile/schema-pbta/issues/40) | Confirms the shared protocol-1 coordination contract and requires independent Lantern and Handbook proofs without local fallbacks. |
| [schema-adrenaline v2.5.0-rc.2 archive](https://github.com/RebelliousSmile/schema-adrenaline/releases/download/v2.5.0-rc.2/schema-adrenaline-2.5.0.tgz) | The published bytes resolve to package version 2.5.0, the declared SHA-256, and SHA-512 SRI `sha512-cb/ZUmHy5LYaMQPmit7tRQIybBQWW8fFN4fgeaHZYoSZHKFuQJgIFVc3p/BhgRVhT00dT7r9DZCk7gmPMTpkjQ==`. |

## Decisions

| Decision | Why |
| --- | --- |
| Represent supported candidates with an explicit provider allowlist and provider-owned URL/package rules. | Adding Adrenaline must not turn strict PBTA validation into permissive string interpolation or accept arbitrary repositories. |
| Keep one common protocol-1 manifest and the existing single-`lock` evidence envelope while dispatching provider-specific consumer journeys. | The external verifier accepts exactly one active lock object; Lantern can verify its secondary lockfile as a named journey check without changing the shared evidence schema. |
| Reuse the proven Adrenaline contract/build journey without restoring its retired legacy manifest parser. | Git history shows the dedicated assertion predated protocol 1; reviving its envelope would create a second incompatible release-train contract. |
| Use the allowlisted `candidate.provider` directly as the dependency package name and dispatch only the provider-specific journey. | Both supported provider identifiers are their npm package names; a second provider-to-package table would duplicate protocol authority and could drift. |
| Treat published archive URLs as the only dependency source in package metadata and both lockfiles. | The release train must remain reproducible and must never fall back to a local checkout, workspace override, or mutable package source. |
| End Lantern's responsibility at its verified evidence and immutable consumer SHA. | Updating the coordinator to accept Adrenaline and dispatching the two-consumer train belong to `schema-pbta#40`, outside this repository's file scope. |
