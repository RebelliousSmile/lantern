---
objective: "Lantern accepts, consumes, and proves the strict protocol-1 schema-adrenaline 2.5.0 candidate, including its canonical monster states, while preserving the schema-pbta path and forbidding local fallbacks."
status: in-progress
---

# Plan: Accept schema-adrenaline protocol-1 candidates

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Generalize Lantern's release-train parser and proof dispatcher, adopt the published Adrenaline 2.5.0 candidate and its canonical monster-state model, then emit a compatible immutable proof. |
| **Source** | [RebelliousSmile/lantern#45](https://github.com/RebelliousSmile/lantern/issues/45) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Strict provider-aware protocol | [`phase-1.md`](./phase-1.md) |
| 2 | Provider-specific proof dispatch | [`phase-2.md`](./phase-2.md) |
| 3 | Candidate and canonical-state adoption | [`phase-3.md`](./phase-3.md) |
| 4 | Committed consumer proof | [`phase-4.md`](./phase-4.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern #45](https://github.com/RebelliousSmile/lantern/issues/45) | Defines the Lantern parser, dispatcher, dual-lockfile, SHA, installation, and full-commit acceptance requirements. |
| [schema-pbta #40](https://github.com/RebelliousSmile/schema-pbta/issues/40) | Confirms the shared protocol-1 coordination contract and requires independent Lantern and Handbook proofs without local fallbacks. |
| [schema-adrenaline v2.5.0-rc.2 archive](https://github.com/RebelliousSmile/schema-adrenaline/releases/download/v2.5.0-rc.2/schema-adrenaline-2.5.0.tgz) | The published bytes resolve to package version 2.5.0 and the verified digests; its codec migrates legacy `etatAlternatif` into canonical `etats`, and it exports `resoudreEtatMonstre` for active-profile resolution. |

## Decisions

| Decision | Why |
| --- | --- |
| Represent supported candidates with an explicit provider allowlist and provider-owned URL/package rules. | Adding Adrenaline must not turn strict PBTA validation into permissive string interpolation or accept arbitrary repositories. |
| Keep one common protocol-1 manifest and the existing single-`lock` evidence envelope while dispatching provider-specific consumer journeys. | The external verifier accepts exactly one active lock object; Lantern can verify its secondary lockfile as a named journey check without changing the shared evidence schema. |
| Reuse the proven Adrenaline contract/build journey without restoring its retired legacy manifest parser. | Git history shows the dedicated assertion predated protocol 1; reviving its envelope would create a second incompatible release-train contract. |
| Use the allowlisted `candidate.provider` directly as the dependency package name and dispatch only the provider-specific journey. | Both supported provider identifiers are their npm package names; a second provider-to-package table would duplicate protocol authority and could drift. |
| Treat published archive URLs as the only dependency source in package metadata and both lockfiles. | The release train must remain reproducible and must never fall back to a local checkout, workspace override, or mutable package source. |
| Store and export monster states only as canonical `etats`/`etatActif`, while accepting legacy `etatAlternatif` through the published codec. | Adrenaline 2.5.0 intentionally migrates the read-only legacy shape; keeping a consumer-owned parallel format would lose multi-state data and violate the schema ownership rule. |
| Represent the base profile by omitting `etatActif`; reserve persisted ids for declared states and require them to be unique schema-valid slugs. | This keeps exports canonical and makes active-state lookup deterministic after additions and renames. |
| Validate each edited state with the provider-exported `EtatDeCreature` schema, then apply Lantern's list-level uniqueness check. | Provider validation avoids copying schema rules into the consumer; uniqueness is a collection invariant required for deterministic active-state lookup. |
| Make the legacy range upgrader convert only properties that are actually present on the source object. | Materializing absent optional keys as `undefined` changes object-spread semantics and corrupts the provider-owned legacy monster-state migration. |
| Fix Lantern's pre-codec range preprocessing without pinning Zod, overriding the archive, or reimplementing the provider migration. | The published codec succeeds on the raw witness; the failure is introduced by Lantern before the codec receives it, so dependency manipulation or a monster-specific fallback would address the wrong ownership layer. |
| Resolve the preview through the published `resoudreEtatMonstre` helper. | The provider owns delta replacement semantics; duplicating them in Lantern would create the forbidden consumer-local fallback. |
| End Lantern's responsibility at its verified evidence and immutable consumer SHA. | Updating the coordinator to accept Adrenaline and dispatching the two-consumer train belong to `schema-pbta#40`, outside this repository's file scope. |
