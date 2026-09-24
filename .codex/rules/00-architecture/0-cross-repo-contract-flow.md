# Cross-repository document contract flow

## Ownership

- Version document contracts in schema packages.
- Version presentation semantics beside contracts.
- Keep user data separate from metadata.
- Publish blocks, regions, and section order.
- Publish tokens, assets, variants, and styles.
- Keep game semantics outside consumers.
- Keep runtime adapters consumer-owned.
- Delegate schema validation, normalization, and derived-value resolution to published provider exports; keep only UI and collection invariants in consumers.

## Delivery

- Extend schema before consumer work.
- Release schema packages before consumer adoption.
- Drive Handbook menus from published metadata.
- Drive Lantern forms from published metadata.
- Reject consumer-local semantic fallbacks.
- Preserve absent optional properties in pre-codec legacy adapters; transform only values actually present on the source object.
- Verify corpus and cross-tool round trips.
- Preserve shared evidence envelopes when adding provider-specific checks; record secondary lockfile or journey verification as named checks.
- Run consumer release proofs against an immutable product commit and communicate that exact SHA even when documentary completion commits follow it.
