# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.7.1] - 2026-09-12

### Removed

- **The fourteen Mist templates' local `schema.ts` type-only re-exports.** Every `model.ts` and
  `toml.ts` under Legend in the Mist, City of Mist and :Otherscape now imports its types directly
  from `@/contracts/mist-engine`, aliased to the same local names. PbtA's two `schema.ts` files are
  unaffected.

## [v0.7.0] - 2026-09-12

### Added

- **A contract-driven document registry.** Every document type now resolves to its parser,
  serializer and label through a `<contract>/<target>` key spanning three published packages —
  Mist, PbtA and Adrenaline — instead of a per-template hand-rolled schema lookup.
- **One conformance corpus across three contract dialects.** `npm run assert:contracts` folds each
  package's own manifest shape (Mist, PbtA, Adrenaline) into one generic runner, replacing the
  Mist-only `assert-mist-contract` script.
- **PbtA templates driven by their game definition.** A Playbook's editor form is generated from
  the active Game Definition's attribute dictionary — eleven discriminated renderers — instead of
  being hand-written per game, so a brand-new PbtA game needs no Lantern code change.
- **A guard against a Handbook checkout drifting from the corpus.** `npm run assert:cross-repo`
  chains schema, Lantern export, Handbook read/write and schema re-parse, and reports a documented
  baseline against the sibling Obsidian plugin checkout.

### Changed

- **Every Mist document now resolves through the generic contract registry** instead of a direct
  import; the write-only `schema` field on `TemplateDefinition` is replaced by `contractKey`.
- **`GameId` opened from a closed union to a declared string**, with a neutral theme fallback and a
  registry-derived game grouping, so adding a game no longer means editing four files.

## [v0.6.0] - 2026-09-11

### Added

- **The document schemas and codecs now come from a published package.** `schema-in-the-mist@v1.0.0`
  is a real dependency; the fourteen `src/templates/<game>/<object>/schema.ts` are re-exports of the
  published symbols, and every `toml.ts` reads and writes through the canonical codecs wrapped by
  `src/contracts/mist-engine.ts`. A format is authored and released in the schema repository, then
  consumed here.
- **A round-trip guard over Lantern's own template modules.** `npm run assert:mist-contract` no
  longer stops at the package's codecs: it imports the seventeen `accept` witnesses of the shipped
  contract corpus through the fourteen template modules and asserts that each one exports back
  without losing a field, the second export byte-identical to the first. A published target with no
  module in this repo fails the run instead of passing unnoticed.

### Fixed

- The import dialog no longer claims a template detection it never performed. It announces the
  document that was read — `Imported "The Reading I Cannot Stop"` — and falls back to a plain
  `Imported.` when the file carries no name, instead of borrowing the active template's label.

## [v0.5.1] - 2026-09-10

### Added

- **Game packs.** The sidebar's game list is now filtered by a checkbox menu on the group: a pack
  the table does not play is hidden from the launcher without touching its open tabs. Each pack's
  collapsible also remembers whether it is unfolded. Both settings persist under their own storage
  key, and the disabled set is what is stored, so a pack added later shows up on its own.
- The welcome screen now explains the app in four steps — pick a pack, open a template, edit from
  the sheet, export — where it used to spend its lower half on an early-development warning.
- Four screenshots in the README, captured from the running app: the welcome screen, a City of Mist
  Danger with its editor form open, a Legend in the Mist Challenge and an :Otherscape Power Set.

### Changed

- The package is named `lantern`. `index.html`, the sidebar brand row and the empty state already
  said Lantern; `package.json` was the last place carrying `lantern-in-the-mist`.
- `README.md`, `docs/codebase-architecture.md` and `docs/adding-a-template.md` rewritten against the
  current code: the stale `src/templates/legend/challenge/` path is gone, and the game packs, the
  per-game CSS scope roots and the schema-repo-first order are covered.

### Removed

- The project switcher and its three sibling logos. Those projects no longer exist upstream, so the
  sidebar header is a static brand row and the app has no outbound navigation.
- The City of Mist Iceberg placeholder and the `createComingSoonTemplate` factory. Every registry
  entry is implemented; the `implemented` flag survives on the contract as an extension point.

### Fixed

- The City of Mist themebook title rule sat across the capitals instead of under them.
- The themebook keyword sat off the baseline of the header's small caps.


## [v0.5.0] - 2026-09-09

### Added

- **City of Mist Custom Moves.** A standalone move carries its trigger, its roll and up to five
  outcome tiers (`miss`, `hit`, `7-9`, `10+`, `12+`), and can be written from the five MC Toolkit
  templates or freehand.
- **City of Mist Theme Kits.** The themebook questionnaire as the books print it: lettered power
  and weakness tag questions with their selection rules, the motivation zone, crew relationships
  and the five theme improvements.
- **City of Mist Theme Cards.** The filled card a player writes from a themebook: the Attention
  track, the Fade or Crack track, the Mystery or Identity, and lettered power and weakness tags
  with their burn mark and invoke box.
- A shared City of Mist vocabulary (`templates/city-of-mist/shared/`): the card tokens and the
  section components the game's sheets have in common.

### Changed

- The City of Mist previews descend from a `.city-doc` root, so the section, badge and footer
  class names they share with Legend in the Mist and :Otherscape can no longer cross games. The
  Danger Profile is unchanged: its own `.city-danger-` prefix already made it safe.
- The Iceberg is now the only planned City of Mist document.

## [v0.4.0] - 2026-09-08

### Added

- **:Otherscape** support, six templates: Theme, Theme Kit, Loadout Item, Challenge, Power Set
  and Character Trope. Each carries its schema, TOML import/export with warnings, one form per
  region of the sheet, a clickable themed preview and PNG export.
- A shared :Otherscape vocabulary (`templates/otherscape/shared/`): the dark card ground, the
  five theme accents and the section components its six sheets have in common.
- An :Otherscape page background.

### Fixed

- The template landing panel was translucent and its description was unreadable over the darker
  game backgrounds.
- Legend in the Mist and :Otherscape share class names for the documents they both print, and
  every preview stylesheet is bundled globally, so one game's rules could land on the other's
  cards. Each game's rules now descend from its own root.

## [v0.3.0] - 2026-09-08

### Added

- Legend in the Mist **Journey** template: schema, TOML import/export with warnings, one form
  per region of the spread, clickable sections, a band tint per journey type, and PNG export.
- Legend in the Mist **Theme Kit** template: schema, TOML import/export with warnings,
  per-section forms, themed preview spread and PNG export.
- Legend in the Mist **Story Theme** template.
- Feedback dialog.

### Changed

- `LICENSE` now carries both copyright lines, the original author's and the maintainer's,
  because the code is a derivative work.
- README: rewritten, and the supported-content lists moved Journeys, Theme Kits and Story
  Themes from planned to implemented.
- SPA fallback rule (`public/_redirects`) so deep links resolve on static hosting.

### Fixed

- Broken mistdraw link.
- Removed the transparent background option, which was always transparent anyway.
- Tab bar overflowed when too many tabs were open.

---

Versions before `v0.3.0` were never tagged and are not documented here. Their history is the
range `git log 4ca5f9f..8c77781`, ending at the commit that set `0.2.0` in `package.json`.
