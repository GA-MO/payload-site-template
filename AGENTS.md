# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Reuse first, then write

The #1 failure mode here is recreating UI that already exists. Before any UI work, in order:

1. `ls src/components` and `ls src/components/<feature>/` for the area you're touching.
2. Read the nearest existing page under `src/app/(frontend)/` — copy its composition pattern.
3. `rg ComponentName` to confirm props before reusing.

If you catch yourself writing `<button>` with an arrow span, a `<input className="border…">`, or a chip `<span>` — stop, the primitive exists.

### Component layout

- `src/components/*.tsx` — shared primitives, each with a `.stories.tsx` sibling:
  - **Button** — every CTA/link. Has `variant` (`external` | `internal` | `primary`), `size`, `arrow` (`right|left|up|down|diagonal`), `showArrow`.
  - **Input / Textarea / Select / Dropdown / DropdownField** — forms. Use over raw elements.
  - **Tag** — chips/filter pills. Optional `href` makes it a link.
  - **Appear** — reveal-on-scroll wrapper.
  - **TextReveal** — GSAP SplitText text reveal. Wrap pure text only — breaks interactive children.
  - **ScrollElement** — anchor target for in-page nav.
  - **CookieBanner** — GDPR/PDPA banner.
  - Also: Breadcrumb, CoverMedia, HoverUnderline, PageTitle, TextLink.
- `src/components/icons/` — `Arrow{Right,Left,Up,Down,Diagonal}`, `Caret`, `CarouselNav`. Never inline SVG arrows.
- `src/components/admin/` — Payload admin scaffolding (CMS Manual view + nav link).
- `src/components/providers/` — `LenisProvider` (smooth scroll).

Adding a component: feature-scoped → `src/components/<feature>/`. Reusable primitive → `src/components/` root + a `.stories.tsx`.

### House rules

- **Named exports** (`export function X`) for components — default exports only for Next.js pages/layouts and Storybook stories.
- **Server components by default.** Add `"use client"` only for state, effects, or browser APIs. Pages under `src/app/(frontend)/` are async server components that call `getPayload({ config })` directly.
- **`cn()` from `@/lib/cn`** for any conditional className — never template-string concat or ternary-inline.
- **`@/` alias** for all internal imports.
- **No Tailwind magic numbers** (`text-[0.9375rem]`, `leading-[1.48]`). Use scale utilities or `@theme` tokens in `src/app/(frontend)/globals.css`.
- **Motion** through `@/lib/motion` (`MOTION`, `SEQUENCE_STEP`). Tune the whole site's feel from one file.
- **`dayjs`** from `@/lib/dayjs` (preconfigured).
- **Types**: import collection types from `@/payload-types`.

### Figma → code workflow

Figma is the design source of truth. Translate, don't invent.

1. `get_design_context` (or `get_screenshot` + `get_variable_defs`) for the frame you're implementing.
2. Map each Figma component to an existing primitive in `src/components/`:
   - Figma "Button/Primary" → `<Button variant="primary" />`
   - Figma "Tag" → `<Tag>` (add `href` to make it a link)
   - Figma "Input" → `<Input>` / `<Textarea>` / `<Select>`
3. Gap? Decide: extend an existing primitive (props/`className`), or create new in `src/components/<feature>/`.
4. Use Figma variables only through `@theme` tokens in `globals.css` — never hardcode hex/px/font names.
5. Before a full page/screen: prefer `/figma-generate-design` to discover components and assemble incrementally.

### Figma tokens sync

- Source of truth = Figma variables (color, spacing, type).
- `npm run sync:figma-tokens` pulls them and updates the `@theme` block in `src/app/(frontend)/globals.css`.
- Run before starting a feature if the designer flagged a token update.

## Database & schema changes (Postgres + Payload)

DB is `postgresAdapter`. Local dev uses Drizzle **`push`** (auto-sync) — this is Payload's recommended dev workflow; treat the local DB as a sandbox.

- **Changing a collection/global/block field changes the schema.** After editing a Payload config, run `npm run payload -- generate:types` and re-typecheck — `@/payload-types` will be stale otherwise.
- **Never run `npm run migrate` against the dev DB.** Push and migrations don't mix on the same local DB. Push has already synced dev for you.
- **A destructive change (e.g. `array` → `upload hasMany`) makes `push` drop the old table.** Existing rows in that field are lost — plan a re-seed, don't expect data to carry over.
- **Push hangs with no output = it's waiting on the interactive data-loss confirm** (or a slow network fetch in a seed). It is not frozen; it has no TTY.
- **A structural change (rename/restructure a field, change select options) makes `push` AND `migrate:create` show a TTY-only "create or rename?" prompt** — Drizzle can't tell a renamed object from a dropped+created one. Two ways through, by intent:
  - *Keep the data (a true rename):* run the command in a real terminal and pick the matching `~ rename` option.
  - *Sandbox data you'll re-seed (the usual case):* drop the stale objects first so only "create" remains and no prompt fires. After dropping a table, its Postgres `enum`/composite types linger and still trigger the prompt — drop those too (`DROP TYPE IF EXISTS enum_<table>_<field> CASCADE`), then `push`, then re-seed.
- **No undeployed migration is precious.** If `migrate:create` hits the rename prompt and nothing has shipped to prod yet, the clean escape is to delete every file in `src/migrations/` (keep a stub `index.ts` exporting `export const migrations = []` so the config still imports) and regenerate one fresh `initial` — it diffs against empty, so it's all "create" with no prompt.
- **Don't create a migration for every save — it's a ship checkpoint, not a per-change step.** While iterating, let `push` sync dev freely. Create the migration **once, when the feature is stable / about to merge or deploy**: `npm run migrate:create -- <name>` diffs the *net* schema against the DB and writes files to `src/migrations/` (commit them). This only writes files — it does NOT touch the dev DB. Prod runs them via `prodMigrations` in `payload.config.ts` — they apply automatically when the app boots on deploy.
- **A migration that's been committed/deployed is immutable** — never edit it; create a new one for the next change.
- **The migration ships in the same PR as the schema change.** Before opening it, run `git diff --name-only main -- src/collections src/globals src/blocks`; if that lists anything, the branch must also add a `src/migrations/` file.

### Production database — hard rules

- **You never hold prod credentials.** `DATABASE_URI` on a dev machine / in `.env` is always the local DB; prod creds live only in the deploy platform's secrets. Prod migrations run **only** on deploy via `prodMigrations` at app boot.
- **Destructive seeds/scripts self-guard.** Every script under `scripts/` that calls `getPayload` must call `assertLocalDb()` (`scripts/lib/assert-local-db.ts`) first — it throws unless the DB host is `localhost`/`127.0.0.1`. Keep that call when adding a new seed/import script.
- **`push` is forbidden against prod** — Payload disables it when `NODE_ENV=production`; never re-enable.
- **A deployed migration is immutable.** Once it has run on prod its name is recorded in the migrations table; renaming/editing desyncs prod.
- **`migrate:create` does NOT preserve data on a destructive change** — it emits `DROP`/`CREATE` only. For a real prod change you must **hand-edit the generated migration** to backfill: create new → copy old data → drop old, all inside the one auto-transaction Payload wraps each migration in. Pass `req` to every `payload.update`/`payload.db.updateMany` call so it joins that transaction.
- **`npm run build` fails on an unacknowledged destructive migration.** `check:migrations` runs first in `build`, so a migration whose `up()` contains `DROP TABLE`/`DROP COLUMN`/`TRUNCATE` aborts the build until the file carries a `// reviewed-destructive: <why it's safe>` comment.

### Code shape

Short, direct, production-grade. The goal is code a teammate can read once and understand.

- Three similar lines beat a premature abstraction. Don't extract until there are three real uses.
- No defensive code for states that can't happen; validate only at boundaries (page params, server actions, external APIs).
- No dead options, "future-proof" props, fallback branches for missing data the schema guarantees.
- Early returns over nested `if`/ternary. Flat over clever.
- Names carry the WHAT — no comments unless the WHY is non-obvious (a constraint, a workaround). Don't reference the task or PR.
- Don't wrap a primitive in a near-identical wrapper — extend via props/`className` instead.
