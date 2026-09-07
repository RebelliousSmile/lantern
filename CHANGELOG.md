# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
