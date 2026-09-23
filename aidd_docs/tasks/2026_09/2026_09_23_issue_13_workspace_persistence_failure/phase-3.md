# Phase 3: Assert storage-failure recovery

## Outcome

The workspace assertion harness proves failed storage does not discard the in-memory edit and reports the failure to the UI.

## Acceptance

- A thrown `setItem` marks the workspace unsaved.
- The in-memory document mutation remains available to the rescue export.

## Result

Implemented in `tools/assertWorkspace.harness.mts`; verified with `npm run assert:workspace`.
