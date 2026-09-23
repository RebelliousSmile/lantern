---
objective: "Lantern loads only the active template's render module, keeps its registry and workspace behavior intact, and keeps the initial JavaScript below 400 kB."
status: completed
---

# Plan: Lazy template chunks

## Overview

| Field | Value |
| --- | --- |
| **Goal** | Split render-bearing template definitions into lazy Vite chunks without changing a document contract or open-tab behavior. |
| **Source** | [Lantern #14](https://github.com/RebelliousSmile/lantern/issues/14) |

## Phases

| # | Phase | File |
| --- | --- | --- |
| 1 | Separate registry descriptors from template modules | [`phase-1.md`](./phase-1.md) |
| 2 | Load the active module behind a visible boundary | [`phase-2.md`](./phase-2.md) |
| 3 | Prove chunk budget and all-template availability | [`phase-3.md`](./phase-3.md) |

## Resources

| Source | Verified |
| --- | --- |
| [Vite dynamic imports](https://vite.dev/guide/features.html#dynamic-import) | Literal `import()` calls create independently loadable chunks. |

## Decisions

| Decision | Why |
| --- | --- |
| Put each identity and workspace factory in a new non-React `descriptor.ts` beside its template. | Importing metadata from `definition.tsx` would still pull preview/editor React modules into the entry chunk. |
| Load each existing `definition.tsx` through a literal loader map. | Vite can statically analyze and emit one chunk per module without a runtime filesystem lookup. |
| Resolve the active module in a shared provider consumed by both preview and inspector. | `TemplateInspector` is mounted outside `AppMainContent`; a local boundary cannot cover both surfaces. |
| Keep TOML codecs in the lazy definition, not its descriptor. | A codec imports a complete published schema; keeping it static would erase the bundle reduction. |
