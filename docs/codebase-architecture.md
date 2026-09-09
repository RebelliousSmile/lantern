# Codebase Architecture

Lantern is a pure client-side SPA: React + TypeScript on Vite, no backend, no build-time data. Everything below happens in the browser.

## High-level flow

The app is a shared shell plus self-contained template modules.

1. The left sidebar lists the games and their templates, read from `src/core/templates/registry.tsx`.
2. Clicking a template creates a workspace tab in `src/core/workspace/store.ts` and navigates to `/tabs/:tabId`.
3. The shell in `src/App.tsx` and `src/app/` renders either the landing launcher or the editing layout, depending on the tab's `mode`.
4. The template supplies preview, editor, appearance and export panels through the `TemplateDefinition` contract in `src/core/templates/types.ts`.
5. Every tab persists to `localStorage` as `{ doc, view, sheet }`, which makes autosave generic across templates.

## Directory layout

- `src/core/` — the template contract and registry, the workspace store and its selectors, the per-game theme registry, and the game-pack settings.
- `src/core/templates/shell/` — chrome every template reuses: the landing launcher, the inspector shell, the export panel.
- `src/templates/<game>/<object>/` — one template module. `<game>` is `city-of-mist`, `legend-in-the-mist` or `otherscape`.
- `src/app/` — the shell's own pieces: top bar, main content, landing and editing views, inspectors, dialogs, and the hooks holding shell state.
- `src/components/ui/` — generated shadcn/Radix primitives; `src/components/sidebar/` and `markdown/` hold app-specific composites.
- `src/utils/`, `src/hooks/`, `src/styles/` — cross-cutting helpers, the viewport hook, and the four aggregated stylesheets.

## Core subsystems

### Template contract

`TemplateDefinition` is the only extension API. Adding a game object means adding a module and one registry entry — never touching the shell.

Each template owns:

- its document schema and TOML import/export adapters
- blank and example factories
- initial `view` and `sheet` state
- tab title logic and landing copy
- its section list, preview renderer, editor panel, appearance panel
- its export actions

The shell owns routing, tab lifecycle, the landing workflow, layout, mobile/desktop inspector behaviour, and the export panel chrome.

`implemented` and `comingSoonLabel` survive on the contract and are still read in several shell sites, but nothing sets `implemented: false` today: the "Coming soon" branch in the sidebar is unreachable. Treat it as an extension point, not as live behaviour.

### Workspace

`src/core/workspace/store.ts` is the single source of truth. Every open tab stores:

- `doc` — the game object itself, the only Zod-validated slice, and **the only one that crosses the TOML boundary**
- `view` — appearance and export preferences
- `sheet` — which editor section is open

Anything put in `doc` ends up in every exported file, so UI state belongs in `view` or `sheet`.

The store also handles persistence, active tab selection, tab open/close, and a legacy migration from the old single-challenge autosave key. It types all three slices as `unknown`; templates recover their types through `useActiveTemplateTab<TDoc, TView, TSheet>` in `src/core/workspace/selectors.ts`.

Two traps worth knowing: writes clone, **reads do not**, so mutating a nested object handed out by a selector mutates the stored document in place; and `persistWorkspace` is exported but has no callers — the save path is `setAndPersist` inside the store.

### Sidebar and game packs

The sidebar renders `templatesByGame` from the registry, a hand-written list of games whose templates are derived with a `filter` on `gameId`. The **game packs** menu on that group hides packs from the launcher, and each pack's collapsible remembers whether it is unfolded. Both settings live in `src/core/gamePacks.ts` and persist under their own storage key. Hiding a pack filters the launcher only — open tabs of that game keep working.

### Shared shell

- `TemplateLanding.tsx` — blank / example / import launcher
- `TemplateInspector.tsx` — right sidebar shell, three accordions: Editor, General Appearance, Export
- `TemplateExportPanel.tsx` — renders the active template's export actions and passes them a context

These stay template-agnostic. A capability valid for one template belongs in that module and reaches the shell through the contract.

## Template module layout

`src/templates/legend-in-the-mist/challenge/` is the oldest reference; the newer modules (`journey/`, `theme-kit/`, and every City of Mist and :Otherscape card) show the shape to copy today:

```text
definition.tsx   registry entry, landing copy, export actions
model.ts         doc / view / sheet types and factories
schema.ts        Zod validation, vendored from the schema repo
metadata.ts      section list, zoom and background options
sample.ts        the worked example the landing screen offers
toml.ts          TOML import and export
warnings.ts      soft import issues that must not block the import
hooks.ts         workspace-backed typed hooks
editor/          the editor panel, its forms, the appearance panel
preview/         the preview renderer plus its stylesheet
preview/blocks/  one component per region of the sheet
```

Modules diverge on purpose — the City Danger adds `formatting.ts` and a `sample.toml` but has no `warnings.ts` — so do not assume a file exists because a sibling has it.

A game may also hold a `shared/` directory beside its objects: `city-of-mist/shared/` and `otherscape/shared/` each hold a `tokens.css` and the preview wrappers (`Clickable`, `SectionGate`, `SectionHeader`) their documents reuse. A change to a whole game's look goes there, not into one card.

## Styling

Two worlds that must not mix:

| World      | Owns                                     | Lives in                                   |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| App chrome | sidebar, tabs, dialogs, forms, inspector | Tailwind + shadcn tokens, `src/styles/`    |
| Preview    | the rendered game sheet                  | a per-template stylesheet under `preview/` |

App tokens leaking into a preview would land in the exported PNG.

**Every preview stylesheet is bundled globally and inactive tabs stay mounted**, so two games' cards are in the DOM at the same time and share generic class names. Each game therefore has a scope root that every depth-0 selector descends from: `.litm-doc`, `.os-card`, `.city-doc`. A card's own root selector *compounds* with it (`.city-doc.city-kit-page`) because both classes sit on the same element. The City of Mist Danger predates the convention and stands outside it, protected by its own `city-danger-` prefix.

`data-game-theme` carries the active game on the body (page background), on the sidebar provider, and on the preview wrapper (inline Mist tokens).

## Data flow

### Preview click to editor

Editing is preview-driven: there is no form tree to navigate.

1. A preview block calls `openSheet({ kind, mode })` from the template's hook layer.
2. That writes the active tab's `sheet` state.
3. The inspector stays mounted and renders exactly the one form matching `sheet.target.kind`.
4. Form edits write the tab's `doc`; the preview re-renders from the same state.

A field is unreachable until something in the preview opens its form, and `openSheet` no-ops unless the tab is in `editing` mode.

### Import / export

Import: the landing dialog calls `template.io.importToml(...)`, the template validates and normalises, the tab's `doc` is replaced and the tab switches to editing mode. Zod runs **only** at this boundary and before export — never on keystroke — so an invalid document can reach the store and only fails on export.

Export: the shared panel renders the template's actions and calls `run({ doc, view, sheet, fileStem, getPreviewNode })`. The PNG action captures the live preview node with `@zumer/snapdom`; the TOML action serialises the document. Each module currently declares its own local copy of the image action rather than sharing one — copy the neighbouring module's.

## Known defects

- **The inspector mounts twice**, once for the desktop column and once for the mobile drawer, so every form is instantiated twice. A sheet target opened with `mode: 'create'` runs its `autoCreate` effect twice and appends two entries, and every DOM id the forms declare is duplicated.
- **`src/index.css` does not exist.** `.prettierrc` and `components.json` both name it; the real entry is `src/styles/index.css`, so Tailwind class sorting runs degraded and `shadcn add` scaffolds the wrong `utils` path.
- **No SPA rewrite config ships**, so a static host will 404 on a refresh of a `/tabs/:tabId` URL.
- **`npm run format` has never been run repo-wide.** Format the directory you touched, not the tree.

## Contribution rules

- Treat `TemplateDefinition` as the public boundary. No template-specific branch in `App.tsx` or the shared shell unless the capability is genuinely cross-template.
- Keep the workspace store generic; template-specific selectors belong in the module.
- Keep template styles, forms and preview blocks inside the template folder, under the game's scope root.
- A schema is authored in the schema repository first, then vendored here. Changing one side only forks the interchange format.
- Prefer deleting replaced glue over leaving parallel implementations behind.
- Keep comments short and structural: ownership boundaries, data flow, tricky invariants.
