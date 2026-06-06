# Payload Site Template

A Figma + Payload CMS + Next.js starter — primitives, motion system, guardrails, CMS Manual scaffolding, and Claude Code skills baked in.

## Start a new project

```bash
npx degit GA-MO/payload-site-template <project-name>
cd <project-name>
claude
```

Then in Claude:

```
/new-payload-site
```

The skill asks for your project name and Figma file URL, customises `AGENTS.md` and `package.json`, saves project context to memory, and tells you the next commands to run.

## Local dev (once bootstrapped)

```bash
docker compose up -d                # Postgres 17 on :5433
cp .env.example .env                # then edit DATABASE_URI + PAYLOAD_SECRET
npm install
npm run payload -- generate:types
npm run dev                         # http://localhost:3000  + /admin
```

## What's inside

- **`src/components/`** — primitives (Button, Input, Tag, Appear, TextReveal, …) each with a Storybook story.
- **`src/lib/`** — `cn`, `motion`, `dayjs`, `media` helpers.
- **`src/collections/`** — baseline `Users` + `Media`.
- **`src/blocks/`** — generic content blocks (Carousel, FullImage, PairImage, Quote, Text).
- **`docs/cms-manual/`** + `/admin/manual` — in-admin Markdown manual for content editors. Edit the `.md` files; titles/groups in `src/lib/manual.ts`.
- **`scripts/check-migrations.ts`** — build-time gate that blocks unacknowledged destructive migrations.
- **`scripts/lib/assert-local-db.ts`** — destructive scripts refuse to run against a non-localhost DB.
- **`.claude/skills/`** — `/new-payload-site` (bootstrap), `/sync-figma-tokens` (Figma → `@theme`).
- **`AGENTS.md`** — house rules: reuse-first, server-first, Payload migration workflow, Figma workflow.

## Tests

```bash
npm run test            # guardrail unit tests (assert-local-db, check-migrations)
npm run test:storybook  # primitive component tests via Storybook + Vitest
npm run test:smoke      # full template smoke test (clone, install, build, boot)
```

## Stack

Next.js 16 · Payload 3.85 · Postgres 17 · React 19 · Tailwind 4 · GSAP · Lenis · Storybook 10 · Vitest 4.
