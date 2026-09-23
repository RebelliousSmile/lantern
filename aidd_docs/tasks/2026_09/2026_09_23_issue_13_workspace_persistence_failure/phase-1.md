# Phase 1: Expose persistence state

## Outcome

The workspace store retains the live snapshot after a failed `localStorage` write and exposes a nullable persistence error.

## Acceptance

- Every normal workspace write records an error when serialization or storage fails.
- A successful later write clears that error.
- Hydration and legacy migration expose a failed normalization write as well.

## Result

Implemented in `src/core/workspace/store.ts`.
