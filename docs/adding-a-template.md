# Adding a Template

Every template is a self-contained module, registered once. Nothing in the shell should need to change.

## Before writing any code

**The schema comes first, and it comes from the other repository.** Document formats are authored and released in one of three published packages — `schema-in-the-mist`, `schema-pbta`, `schema-adrenaline` (a dev-only dependency, see the memory bank's `architecture.md`) — pinned as an archive dependency in `package.json`. A template's own `schema.ts` is a **type-only re-export** of the published symbol, kept for callers' sake; it carries no runtime Zod object. Writing the schema here first, or editing a `schema.ts` expecting a shape change, inverts the order and does nothing: the shape a document is checked against at runtime comes from the contract registry (`documentContracts` / `nodeDocumentContracts`), keyed by `<contract>/<target>`, not from the file's own export.

## Folder layout

```text
src/templates/<game>/<object>/
```

`<game>` is `city-of-mist`, `legend-in-the-mist` or `otherscape`. Files:

```text
definition.tsx   registry entry, landing copy, export actions
model.ts         doc / view / sheet types and factories
schema.ts        type-only re-export of the published package's schema
metadata.ts      section list, zoom and background options
sample.ts        the worked example the landing screen offers
toml.ts          TOML import and export
warnings.ts      soft import issues that must not block the import
hooks.ts         workspace-backed typed hooks
editor/          editor panel, forms, appearance panel
preview/         preview renderer + stylesheet
preview/blocks/  one component per region of the sheet
```

Copy the closest **recent** module rather than the oldest one. `legend-in-the-mist/theme-kit/` and `city-of-mist/theme-card/` are the current shape; `legend-in-the-mist/challenge/` is the historical reference and predates the block decomposition.

If the game already has a `shared/` directory (`city-of-mist/shared/`, `otherscape/shared/`), reuse its tokens and its `Clickable` / `SectionGate` / `SectionHeader` wrappers instead of writing new ones.

## Implementation steps

### 1. Define the state

In `model.ts`, declare the document type, the template-specific `view` and `sheet` types, and the blank/default factories.

Keep `view` to appearance and export concerns and `sheet` to editor selection. **Only `doc` crosses the TOML boundary**, so anything you put there lands in every user's exported file.

### 2. Validation and sample data

`schema.ts` re-exports the published package's schema type; it does no normalisation of its own. `sample.ts` exports one rich example — it is what the landing screen offers, so make it show the template off.

### 3. Import and export helpers

In `toml.ts`, implement import and export against the contract's codec, resolved with `documentContracts.require('<contract>/<target>')` (or `nodeDocumentContracts` if the contract is Node-only) — that call is what actually validates, not the local `schema.ts`. Return warnings for soft issues that should not block an import. `warnings.ts` holds the warning logic when there is more than a line of it.

Watch the passthrough trap: an import that spreads `payload.meta` (or any sub-object) straight into the document carries fields the schema never declared into the store. Pick the fields you mean.

### 4. Template hooks

In `hooks.ts`, use `useActiveTemplateTab(...)` from `src/core/workspace/selectors.ts` and expose hooks that read and write the active tab's `doc`, `view` and `sheet`. Every write goes through `useWorkspaceStore`.

Do not create a second persistence store. The workspace store is the source of truth.

Selectors hand out **live references** into the store, so never mutate what one returns: build a new object and write it back.

### 5. Preview and editor

In `preview/`, build the renderer and split it into `preview/blocks/`, one block per region of the printed sheet. Route every section's click through the template's sheet hook.

The stylesheet lives beside it and **must be scoped**: every depth-0 selector descends from the game's root class (`.city-doc`, `.litm-doc`, `.os-card`), the sheet's own root selector _compounds_ with that class, and every class of your own carries a per-document prefix (`city-card-`, `city-kit-`, …). Preview stylesheets are bundled globally and inactive tabs stay mounted, so an unscoped generic name like `.section-title` will repaint another game's card.

In `editor/`, build the panel that resolves `sheet.target`, the forms it needs, and the appearance panel for template-specific settings.

Two vocabularies that are easy to conflate: `sheet.target.kind` decides _which form opens_ and is per template; the `SectionId` list in `metadata.ts` drives the appearance panel's show/hide toggles and the definition's `sections`. They are different lists.

Every clickable preview region needs a matching editor target — a field with no way to open its form is unreachable.

### 6. Register it

`definition.tsx` exports a `TemplateDefinition` wiring identity and labels, schema, blank/example creators, initial view and sheet, tab title logic, landing copy, the section list, the preview renderer, the editor panel, the appearance panel, the export actions, and a `contractKey: string` (`<contract>/<target>`, e.g. `pbta/playbook`) naming the registry entry `toml.ts` resolves against.

Then add the module to `src/core/templates/registry.tsx`. Adding a template to a game that already exists needs no other edit — `templatesByGame` is a fold over `templateRegistry` that groups by `gameId` on first occurrence. A load-time loop (`registry.tsx:45-47`) calls `documentContracts.require(template.contractKey)` for every template, so a typo'd `contractKey` fails immediately at load rather than at the first export.

## Export actions

Export actions are the extension point beyond the shell's own chrome. Each declares `id`, `label`, `description`, an optional `renderSettings`, and `run(context)`, and uses the given context rather than reaching back into global state.

Every module ships a TOML action and the shared `createImageExportAction` (`src/core/templates/shell/imageExportAction.ts`), imported by every game's `definition.tsx` rather than reimplemented. Call it with `{ description, renderSettings }`; it captures the live preview node with `@zumer/snapdom` at the view's `exportPrefs.scale`, handles the missing-node and capture-failure toasts, and downloads `<fileStem>@<scale>x.png`. Write a new export action only for a genuinely different format — do not fork this one.

## Adding a whole game

No longer the expensive step it once was. `GameId` is a bare `string`, `gameThemeRegistry` is a
`Partial` map that falls back to a `neutralGameTheme` constant for any game with no entry, and
`templatesByGame` derives itself from `templateRegistry` — none of the three needs an edit, and a
themeless game degrades to no page background in `game-themes.css` instead of needing a new rule.
The one real cost that remains:

- a new scope root class, applied to every preview wrapper of that game (see the memory bank's
  `design.md`, "One scope root per game")

## Verification checklist

- it appears in the sidebar, under the right game pack
- it opens a tab, and blank / example / import all work
- the preview renders from the example document
- clicking each preview region opens the matching editor form
- edits update the preview immediately
- `view` settings affect the active tab only
- TOML round-trips: export, re-import, compare
- PNG export works, including at a non-default scale — remote fonts only embed once loaded
- reloading the page restores the tab
- opening a document of another game in a second tab leaves both previews correct
- `npx prettier --write ./src/templates/<game>/<object>` — format the module, not the tree
- `npm run lint` passes
- `npm run build` passes; it is the only typecheck

There is no test runner. The list above is the gate.

## Rules for humans and LLMs

- No template-specific logic in `App.tsx` or the shared shell unless it belongs to every template.
- Do not recreate the deleted legacy challenge stores.
- Need a cross-template capability? Extend `TemplateDefinition` first, then the shared shell.
- Keep the module cohesive: model, validation, preview, editor, appearance and export live together.
- Beware the inspector's **double mount** (desktop column + mobile drawer): a `mode: 'create'` sheet target runs its `autoCreate` effect twice, and every DOM id is duplicated. Scope any locator to the visible element.
