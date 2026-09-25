# Releasing Lantern

Lantern releases are identified by one stable package version, one `v<version>` tag, and the full
commit selected by that tag. The same version must appear in `package.json`, both npm lock roots,
and the first release heading in `CHANGELOG.md`. Existing release tags and changelog sections are
immutable.

Every `v*` tag must point to a commit already on `main`. The tag workflow performs a frozen npm
install, runs the complete default check, rebuilds `dist`, and creates a normalized tar archive.
Archive paths are sorted and timestamps, owner, and group metadata are fixed so rebuilding the same
tree produces the same digest.

The same-name GitHub Release is Lantern's publication authority. It contains exactly:

- `lantern-v<version>.tar.gz`, the production `dist` bundle;
- `lantern-v<version>.evidence.json`, protocol-1 evidence recording the version, tag, full commit,
  bundle SHA-256, and the sorted path, size, and SHA-256 of every production file.

Deployment status is not release evidence. A workflow retry may reuse an existing Release only
when its tag, target commit, attachment names, bundle bytes, evidence, and per-file digests match
exactly. Missing or conflicting attachments fail the workflow instead of being overwritten.

Before creating a tag, all schema dependencies must use canonical stable GitHub Release URLs.
Candidate `-rc` channels are deliberately rejected by the release identity validator.
