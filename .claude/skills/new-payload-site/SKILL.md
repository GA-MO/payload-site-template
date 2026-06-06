---
name: new-payload-site
description: Bootstrap a new project freshly cloned from payload-site-template. Customises AGENTS.md, package.json, and saves project context to memory. Trigger after `degit GA-MO/payload-site-template <name>` when the project hasn't been personalised yet.
---

# What to do

You are running inside a freshly-cloned `payload-site-template` checkout. Your job is to turn it from "template" into "this user's project". Do every step.

## 1. Confirm we're in a fresh template

- Read `package.json`. If `"name"` is anything other than `"payload-site-template"`, the project has already been bootstrapped — tell the user and stop (offer to re-run if they really want to).
- Read `AGENTS.md`. If a `## Project: ` heading already exists, same thing — already bootstrapped, stop.

## 2. Ask for project info

Use AskUserQuestion with three questions. For the default project name, run `basename "$(pwd)"` first so you can offer it.

1. **Project name** — kebab-case slug, used as the npm package name (default: the current folder name).
2. **Figma file URL** — paste the figma.com link; leave blank if no Figma yet.
3. **One-line domain summary** — what is this project? (e.g. "Restaurant marketing + table booking, 14-day window")

Derive the **Display Name** from the kebab-case slug by Title-Casing each word (e.g. `klong-phadung` → `Klong Phadung`). Use the slug in `package.json`, the Display Name in the `## Project:` heading.

## 3. Customise files

- `package.json`: Edit `"name": "payload-site-template"` → `"name": "<slug>"`. Exact match — there is only one such line.
- `AGENTS.md`: append the project section. First read the last 5 lines with the Read tool, then Edit using the literal last non-empty line as `old_string` and that same line + the new section as `new_string`. Template (preserve the blank line before the heading):
  ```markdown
  <last non-empty line of AGENTS.md>

  ## Project: <Display Name>

  - <one-line domain summary>
  - Figma: <url or "TBD">
  ```
- If a Figma URL was provided: call `mcp__plugin_figma_figma__get_metadata` with `{ fileKey: "<extracted-from-url>" }`. On success, print the file name back to the user as confirmation. On error, mention it but don't block — the URL still gets recorded.

## 4. Save project memory

The memory path is derived from cwd by replacing `/` with `-`. Example: cwd `/Users/sbpdigital/Development/klong` → memory dir `~/.claude/projects/-Users-sbpdigital-Development-klong/memory/`.

Write **two** files there:

1. `project_<slug>.md` — the memory itself, using this exact frontmatter and body shape:

   ```markdown
   ---
   name: project-<slug>
   description: <one-line domain summary, plus "cloned from payload-site-template">
   metadata:
     type: project
   ---

   <Display Name> is <one-line domain summary>, cloned from `GA-MO/payload-site-template`.

   **Why:** <one sentence on what makes this domain shape decisions — the booking model, the regulated industry, the brand constraints, etc. If the user gave nothing specific, write: "Stack is shared with the template; the domain itself is what shapes every collection and page decision.">

   **How to apply:** When implementing a feature, ask "does it serve <domain area A> or <domain area B>?" — they likely have different freshness/auth/SEO needs. Refer to the Figma file before adding new components.

   Figma source of truth: <url or "TBD">
   ```

2. `MEMORY.md` — the index. If it doesn't exist, create it with one line:

   ```markdown
   - [Project <Display Name>](project_<slug>.md) — <one-line domain summary>
   ```

   If it exists (shouldn't on a fresh bootstrap, but be defensive), append the line rather than overwriting.

## 5. Capture the bootstrap as a commit

```
git add package.json AGENTS.md
git commit -m "Bootstrap <slug> from payload-site-template"
```

This freezes the "fresh template → this project" moment in history so future diffs are meaningful. Don't add other files — leave `git status` clean of template noise so the user can review.

## 6. Tell the user next steps

Print these as a checklist:

```
□ docker compose up -d                        # Postgres on :5433
□ cp .env.example .env                        # then edit DATABASE_URI + PAYLOAD_SECRET (use any random string)
□ npm install
□ npm run payload -- generate:types
□ npm run dev                                 # http://localhost:3000  + /admin
□ Register your admin user on first /admin visit
```

Then suggest: "Try `/sync-figma-tokens` once you have a Figma URL and want to pull design tokens into `globals.css`."

## Idempotency

If re-run after bootstrap (step 1 catches this), do nothing destructive. Don't duplicate the `## Project:` section, don't overwrite memory.

## Don't

- Don't initialise git — the user already has a working tree.
- Don't run `npm install`, `docker compose`, or any long-running setup commands. Tell the user; let them run.
- Don't fetch external resources beyond the Figma metadata check.
