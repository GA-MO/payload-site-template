# CMS Manual

This is the manual content editors see at `/admin/manual` after logging into the admin panel.

## How it works

- Source files live under `docs/cms-manual/*.md` — also render on GitHub.
- Titles, groups, and ordering are declared in [`src/lib/manual.ts`](../../src/lib/manual.ts) (`MANUAL_DOCS` + `MANUAL_GROUPS`).
- The admin view (`src/components/admin/ManualView.tsx`) reads the Markdown at request time, renders with `react-markdown`, and ships a client-side fuzzy search across every heading.
- Screenshots go in `docs/cms-manual/images/`. Reference them from Markdown as `images/your-shot.png` — they're served by a gated route at `/admin/manual-assets/`.

## Adding a doc

1. Drop the `.md` file under `docs/cms-manual/` (kebab-case with a numeric prefix for ordering).
2. Add an entry to `MANUAL_DOCS` in `src/lib/manual.ts`:
   ```ts
   { slug: "02-my-doc", title: "My Doc", group: "Content" }
   ```
3. If you introduce a new group, add it to `MANUAL_GROUPS`.
4. Verify in `/admin/manual` — the nav and search index update automatically.

## Editing rules

- Write in plain Markdown — GFM tables, fenced code, headings (h2/h3 show in the "On this page" rail).
- Speak to the content editor, not the developer. No code-level jargon unless the editor needs it.
- Relative links between docs: use `<slug>.md` (e.g. `[Works](01-works.md)`) — the view rewrites these to `?doc=` query params at render time.
- Images: `![alt](images/file.png)`.
