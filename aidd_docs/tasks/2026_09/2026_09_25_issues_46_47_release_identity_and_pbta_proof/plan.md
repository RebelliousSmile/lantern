---
objective: "Lantern proves the schema-pbta 8.4.3 browser-subpath candidate, converges every promoted schema dependency, validates all three provider trains by default, and publishes v0.16.1 with matching package, tag, changelog, GitHub Release, and artifact evidence."
status: in-progress
---

# Plan: Prove PbtA assets and restore release identity

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Complete the scoped PbtA candidate proof first, then enforce Lantern-wide provider convergence and an auditable GitHub Release contract. |
| **Source** | [RebelliousSmile/lantern#46](https://github.com/RebelliousSmile/lantern/issues/46) and [RebelliousSmile/lantern#47](https://github.com/RebelliousSmile/lantern/issues/47) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | PbtA browser-subpath candidate adoption | [`phase-1.md`](./phase-1.md) |
| 2 | Runnable four-asset evidence | [`phase-2.md`](./phase-2.md) |
| 3 | Lantern release identity contract | [`phase-3.md`](./phase-3.md) |
| 4 | Three-provider protocol and real-manifest matrix | [`phase-4.md`](./phase-4.md) |
| 5 | Final provider and consumer-pin convergence | [`phase-5.md`](./phase-5.md) |
| 6 | Immutable v0.16.1 publication | [`phase-6.md`](./phase-6.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern #46](https://github.com/RebelliousSmile/lantern/issues/46) | Defines release identity, canonical final pins, the default Mist/PbtA/Adrenaline matrix, and exact application-artifact evidence. |
| [Lantern #47](https://github.com/RebelliousSmile/lantern/issues/47) | Defines the PbtA browser-only import, v8.4.3 candidate locks, four served assets, cleanup, and immutable candidate evidence. |
| [schema-pbta #41](https://github.com/RebelliousSmile/schema-pbta/issues/41) | Establishes that Lantern must prove the v8.4.3 candidate before byte-identical final promotion and must not move browser URL construction back to the package root. |
| [schema-adrenaline #36](https://github.com/RebelliousSmile/schema-adrenaline/issues/36) | Requires consumers to leave v2.5.0-rc.2 only after the canonical final archive exists with the published SRI. |
| [schema-in-the-mist #25](https://github.com/RebelliousSmile/schema-in-the-mist/issues/25) | Requires both consumers to converge on the final v1.3.5 archive and makes the committed Mist train part of routine validation. |
| [Obsidian Handbook #63](https://github.com/RebelliousSmile/obsidian-handbook/issues/63) | Confirms the other consumer owns CommonJS/Obsidian load proof and must converge its own final pins before consumer releases. |

## Decisions

| Decision | Why |
| --- | --- |
| Keep #47 candidate proof and #46 final convergence as separate immutable checkpoints in one ordered plan. | The provider must consume a stable candidate-evidence commit before promotion; replacing the URL earlier would destroy the evidence target. |
| Standardize Lantern tags on a GitHub Release carrying the built bundle and machine-readable evidence, not deployment records. | Lantern has prior GitHub Releases but GitHub reports no deployment records, and its documented hosting flow is operator-managed. |
| Publish the corrective consumer release as v0.16.1. | v0.16.0 already names a commit whose package metadata is 0.15.2; a new patch tag preserves immutable history while restoring agreement. |
| Keep one strict provider table for Mist, PbtA, and Adrenaline and dispatch a provider-specific, consumer-owned Vite journey from it. | The default matrix must cover all three real providers without weakening repository, archive-name, digest, or tag validation. |
| Preserve protocol 1's closed evidence shape: identify the exact consumer through its full commit and canonical journey checks, and put byte-level bundle digests only in Lantern's separate GitHub Release evidence. | The provider validator rejects extra evidence fields; source provenance and runnable checks belong to the shared envelope, while release-asset provenance belongs to Lantern's release contract. |
| Require exact canonical final URLs and SRIs for all three schema packages in both consumers after promotion. | Major-only or version-only comparison permits release-channel drift and cannot reject stale prerelease pins. |
| Preserve provider semantics in provider packages and keep only Vite import, rendering, and release orchestration in Lantern. | The project rule forbids consumer-local schema or presentation fallbacks. |
| Make release and matrix checks fixture-testable without requiring a tag or network, then reserve published-archive and GitHub Release checks for their explicit journeys. | Pull-request checks must deterministically reject bad identities while release publication still verifies the real external objects. |
| Execute implementation and release work on `main` without branches or worktrees. | The project's main-only execution rule applies to every phase, including the immutable candidate and release checkpoints. |
| Define the default real-manifest set as every active canonical protocol-1 manifest named by the coordinating provider issues, pinned by provider commit and path in Lantern with at least one entry per provider. | Multiple active manifests for one provider remain valid; superseded legacy envelopes stay historical rather than creating a second protocol. |
| Separate real-manifest journey dispatch from immutable candidate resolution. | The default matrix can replay the current artifact journey selected by a real manifest after final convergence, while URL/lock/ref equality remains the provider-orchestrated assertion at that manifest's recorded consumer commit. |
