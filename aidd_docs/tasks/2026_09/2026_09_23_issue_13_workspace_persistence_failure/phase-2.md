# Phase 2: Add rescue UI and export

## Outcome

Lantern visibly warns that the current workspace is unsaved and lets the user download its complete current snapshot.

## Acceptance

- The warning is exposed with `role="alert"`.
- The rescue file contains version, tabs, tab order, and active tab.
- User-visible text is available in English and French.

## Result

Implemented in `src/App.tsx` and the common locale resources.
