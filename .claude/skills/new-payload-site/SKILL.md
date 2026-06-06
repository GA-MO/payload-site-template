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

Use AskUserQuestion with three questions:

1. **Project name** — kebab-case, used as the package name and folder slug (default: the current folder name).
2. **Figma file URL** — paste the figma.com link; leave blank if no Figma yet.
3. **One-line domain summary** — what is this project? (e.g. "Restaurant marketing + table booking, 14-day window")

## 3. Customise files

- `package.json`: set `"name"` to the user's project name (Edit, replace the `"name"` field).
- `AGENTS.md`: append a new section at the end:
  ```markdown

  ## Project: <Name>

  - <one-line domain summary>
  - Figma: <url or "TBD">
  ```
  Use Edit with `old_string` = end of file marker (the last paragraph) and `new_string` = same paragraph + the new section.
- If you have a Figma URL: try `mcp__plugin_figma_figma__get_metadata` to fetch the file name and confirm it loads — surface any error to the user but don't block.

## 4. Save project memory

Save a `project` memory at `~/.claude/projects/<cwd-slug>/memory/project_<slug>.md` describing the domain + Figma link + the fact this is a `payload-site-template` clone. Update `MEMORY.md` index. Include **Why:** and **How to apply:** lines per the memory rules.

## 5. Tell the user next steps

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
