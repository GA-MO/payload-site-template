---
name: sync-figma-tokens
description: Pull Figma variables (color, spacing, type) for the project's Figma file and rewrite the `@theme` block in `src/app/(frontend)/globals.css`. Trigger when the designer flags a token update or before starting a feature whose visual tokens may have drifted.
---

# What to do

> **Status: stub.** The Figma → `@theme` pipeline isn't fully wired yet. Until it is, do the manual steps below.

## Manual fallback

1. Open the project's Figma file (look in `AGENTS.md` under `## Project:` for the URL).
2. Call `mcp__plugin_figma_figma__get_variable_defs` on the variables collection.
3. For each color variable: write `--color-<name>: <hex>;` inside the `@theme inline { ... }` block in `src/app/(frontend)/globals.css`.
4. For each spacing variable: write `--spacing-<name>: <rem>;`.
5. For each font variable: write `--font-<role>: <stack>;`.
6. Run `npm run dev` and visually check that tokens compile (no missing `--color-…` references in primitives).

## Future automation

`scripts/sync-figma-tokens.ts` will:
- Read the Figma file URL from the `## Project:` section of `AGENTS.md` (single source of truth).
- Call the Figma MCP `get_variable_defs` and `get_design_context` tools.
- Transform variables → `@theme` CSS custom properties.
- Replace the existing `@theme inline { ... }` block in `globals.css` in place (preserve the surrounding CSS exactly).
- Print a diff so the user can review before committing.

For now the script is a stub that prints "not implemented" — see `scripts/sync-figma-tokens.ts`.
