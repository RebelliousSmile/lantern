---
objective: "Lantern proves the schema-adrenaline 2.6.0 candidate on an immutable commit, converges all three schemas only after its promotion, validates the provider trains, and publishes v0.16.1 with matching release identity and artifact evidence."
status: in-progress
---

# Plan: Restore Lantern release identity and converge schema pins

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Complete Lantern-wide provider convergence and an auditable GitHub Release contract, building on the already recorded PbtA candidate proof. |
| **Source** | [RebelliousSmile/lantern#46](https://github.com/RebelliousSmile/lantern/issues/46) and [RebelliousSmile/lantern#47](https://github.com/RebelliousSmile/lantern/issues/47) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | PbtA browser-subpath candidate adoption | [`phase-1.md`](./phase-1.md) |
| 2 | Runnable four-asset evidence | [`phase-2.md`](./phase-2.md) |
| 3 | Lantern release identity contract | [`phase-3.md`](./phase-3.md) |
| 4 | Three-provider real-manifest matrix | [`phase-4.md`](./phase-4.md) |
| 5 | Adrenaline 2.6.0 candidate adoption checkpoint | [`phase-5.md`](./phase-5.md) |
| 6 | Provider-owned candidate proof | [`phase-6.md`](./phase-6.md) |
| 7 | Final provider and consumer-pin convergence | [`phase-7.md`](./phase-7.md) |
| 8 | Immutable v0.16.1 publication | [`phase-8.md`](./phase-8.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Lantern #46](https://github.com/RebelliousSmile/lantern/issues/46) | Defines release identity, canonical final pins, the default Mist/PbtA/Adrenaline matrix, and exact application-artifact evidence. |
| [Lantern #47](https://github.com/RebelliousSmile/lantern/issues/47) | Defines the PbtA browser-only import, v8.4.3 candidate locks, four served assets, cleanup, and immutable candidate evidence. |
| [schema-pbta #41](https://github.com/RebelliousSmile/schema-pbta/issues/41) | v8.4.3 is final; committed protocol-1 provenance contains Lantern's passed proof at `d3de6d8`. |
| [schema-adrenaline v2.6.0-rc.1](https://github.com/RebelliousSmile/schema-adrenaline/releases/tag/v2.6.0-rc.1) | The published candidate archive declares package version 2.6.0; its SHA-256 is `9dc51da464ae0caae7a44fcafb1e932656ab2612299430655055fae37716e212`. No v2.6.0 provider manifest or final archive exists yet. |
| [schema-adrenaline #36](https://github.com/RebelliousSmile/schema-adrenaline/issues/36) | The older v2.5.0 final archive remains noncanonical. It does not substitute for a v2.6.0 candidate proof or promotion. |
| [schema-in-the-mist #25](https://github.com/RebelliousSmile/schema-in-the-mist/issues/25) | The v1.3.5 final archive exists; the committed `release-trains/v1.3.5.json` is a provider-owned legacy envelope, and post-promotion consumer evidence remains to be completed. |
| [Obsidian Handbook](https://github.com/RebelliousSmile/obsidian-handbook) | Its local candidate adoption points to v2.6.0-rc.1 with matching SRI, but the pnpm package entry still says version 2.5.0; Handbook owns that correction and its proof commit. |

## Decisions

| Decision | Why |
| --- | --- |
| Keep #47 candidate proof and #46 final convergence as separate immutable checkpoints in one ordered plan. | The provider must consume a stable candidate-evidence commit before promotion; replacing the URL earlier would destroy the evidence target. |
| Standardize Lantern tags on a GitHub Release carrying the built bundle and machine-readable evidence, not deployment records. | Lantern has prior GitHub Releases but GitHub reports no deployment records, and its documented hosting flow is operator-managed. |
| Publish the corrective consumer release as v0.16.1. | v0.16.0 already names a commit whose package metadata is 0.15.2; a new patch tag preserves immutable history while restoring agreement. |
| Keep provider-owned manifest validation and dispatch consumer-owned Vite journeys for every real manifest. | PbtA and Adrenaline have both current and historical manifests; Mist currently publishes a different legacy envelope. Lantern must not manufacture replacement provider input. |
| Preserve protocol 1's closed evidence shape: identify the exact consumer through its full commit and canonical journey checks, and put byte-level bundle digests only in Lantern's separate GitHub Release evidence. | The provider validator rejects extra evidence fields; source provenance and runnable checks belong to the shared envelope, while release-asset provenance belongs to Lantern's release contract. |
| Require exact canonical final URLs and SRIs for all three schema packages in both consumers after promotion. | Major-only or version-only comparison permits release-channel drift and cannot reject stale prerelease pins. |
| Preserve provider semantics in provider packages and keep only Vite import, rendering, and release orchestration in Lantern. | The project rule forbids consumer-local schema or presentation fallbacks. |
| Make matrix parsing and release-identity logic fixture-testable without a tag or network; run the default integration gate against one immutable input registry. | Unit checks can reject bad shapes offline, while CI and the release workflow validate the same pinned external repositories and the release workflow alone verifies published attachments. |
| Execute implementation and release work on `main` without branches or worktrees. | The project's main-only execution rule applies to every phase, including the immutable candidate and release checkpoints. |
| Include every committed real train manifest naming Lantern in one immutable input registry, with a single Handbook commit for pin checks. | The current set contains two PbtA manifests, two Adrenaline manifests, and one Mist manifest; historical refs remain historical, while the build, contracts, executable chunks, and four PbtA assets are checked once for the current graph. |
| Separate real-manifest journey dispatch from immutable candidate resolution. | The default matrix can replay the current artifact journey selected by a real manifest after final convergence, while URL/lock/ref equality remains the provider-orchestrated assertion at that manifest's recorded consumer commit. |
| Add a v2.6.0-rc.1 candidate checkpoint before final convergence; leave historical v2.5.0 evidence intact. | The user chose the new Adrenaline train. Its different bytes and version require new immutable Lantern and Handbook proofs before provider promotion. A candidate URL cannot satisfy #46's final-pin criterion. |
| Let the provider publish the v2.6.0 protocol-1 manifest after both consumer commits, then add it to the pinned matrix. | The provider owns the manifest and promotion. Lantern must not invent consumer refs or treat an uncommitted local fixture as authoritative evidence. |
