---
objective: "Every implemented template lets an Obsidian user copy its current TOML directly, inspect the text, hide it, and still download the same .toml file."
status: implemented
---

# Plan: Copy TOML from the export panel

## Overview

| Field      | Value |
| ---------- | ----- |
| **Goal**   | Make copying the current TOML the primary export action, keep the generated text visible until hidden, and retain file download as a secondary action. |
| **Source** | User-approved brainstorm in this conversation. |

## Phases

| #   | Phase | File |
| --- | ----- | ---- |
| 1 | Shared TOML export experience | [phase-1.md](./phase-1.md) |

## Resources

None. The behavior is grounded in the existing repository implementation.

## Decisions

| Decision | Why |
| -------- | --- |
| Extend `TemplateExportPanel` instead of each template definition | All 16 definitions expose `io.exportToml` and use the shared `toml` action id; centralizing preserves the existing download implementations and applies the new flow everywhere. |
| Keep a visible, read-only fallback when clipboard access fails | Obsidian's embedded browser may reject the Clipboard API; visible and selectable TOML still completes the user's manual-paste workflow. |
