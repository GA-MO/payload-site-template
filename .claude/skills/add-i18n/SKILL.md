---
name: add-i18n
description: Migrate this Payload + Next.js project from single-locale to multi-locale using next-intl + Payload localization. Trigger when the user asks for "i18n", "multi-language", "translations", or specifies locales (e.g. Thai + English). Re-running is safe — Step 1 detects already-installed state and stops.
---

# What to do

You are adding i18n to a project bootstrapped from `payload-site-template`. The work spans four layers: Payload content localization, Next.js locale routing (next-intl), UI strings, and a `LocaleSwitcher` primitive. Do every step in order — later steps assume earlier ones happened.

## 1. Confirm i18n is not already added

- Read `package.json`. If `next-intl` is in `dependencies`, stop with: "i18n already configured (next-intl is installed). Re-run only after removing the existing setup."
- Read `src/payload.config.ts`. If a `localization:` block exists, same — stop.

## 2. Ask for inputs

Use AskUserQuestion with three questions:

1. **Locales** — which language codes (comma-separated)? Default: `th, en`.
2. **Default locale** — which to fall back to + show without URL prefix? Default: the first locale.
3. **URL strategy** —
   - `as-needed`: default locale no prefix (`/works` for default, `/en/works` for other) — best for SEO on the default-locale market
   - `always`: every locale prefixed (`/th/works`, `/en/works`) — most explicit
   Default: `as-needed`.

Normalise the locales: lowercase, trim, dedupe. Call this array `LOCALES`. The user's default-locale answer is `DEFAULT_LOCALE`. The URL strategy is `LOCALE_PREFIX`.

## 3. Update `package.json`

Edit `dependencies` to add `"next-intl": "^3.26.5"` (or the latest stable from npmjs.com/package/next-intl — prefer caret range).

## 4. Materialise i18n config files

Read each template in `.claude/skills/add-i18n/templates/i18n/` and write to `src/i18n/` with substitutions:

- `templates/i18n/config.ts` → `src/i18n/config.ts`
  - Replace `{{LOCALES_ARRAY}}` with the array literal joined by commas, e.g. `'th', 'en'`.
  - Replace `{{DEFAULT_LOCALE}}` with the user's default (quoted).
- `templates/i18n/routing.ts` → `src/i18n/routing.ts`
  - Replace `{{LOCALE_PREFIX}}` with the user's choice (quoted, e.g. `'as-needed'`).
- `templates/i18n/request.ts` → `src/i18n/request.ts` (copy as-is).

## 5. Materialise message files

For each locale in `LOCALES`:
- If a template exists at `templates/messages/<locale>.json`, copy it to `src/i18n/messages/<locale>.json`.
- Otherwise, copy `templates/messages/en.json` to `src/i18n/messages/<locale>.json` and note in the final report that the user needs to translate it.

## 6. Materialise middleware

Copy `templates/middleware.ts` → `src/middleware.ts` (as-is).

## 7. Restructure routes under `[locale]/`

Move the `[...not-found]` directory under `[locale]/` (its `page.tsx` just calls `notFound()` and is locale-agnostic). Discard `page.tsx`, `not-found.tsx`, `layout.tsx` — they'll be rewritten from templates in the next step.

```bash
cd "src/app/(frontend)"
mkdir -p '[locale]'
mv '[...not-found]' '[locale]/'
rm page.tsx not-found.tsx layout.tsx
```

Then materialise three fresh files at the new paths (Write — paths don't exist yet, so no Read is required):

- `templates/layout.tsx` → `src/app/(frontend)/[locale]/layout.tsx` (as-is, no substitutions).
- `templates/page.tsx` → `src/app/(frontend)/[locale]/page.tsx`.
- `templates/not-found.tsx` → `src/app/(frontend)/[locale]/not-found.tsx`.

## 8. Edit `src/payload.config.ts`

Add Payload translation imports near the existing imports (one per locale). For locales without a matching Payload language pack, omit the import and exclude from `admin.i18n.supportedLanguages` — but still include in `localization.locales` (content localization works without admin translations).

```ts
import { en } from '@payloadcms/translations/languages/en'
import { th } from '@payloadcms/translations/languages/th'
// add one line per locale that has a Payload language pack
```

Inside the existing `admin: { … }`, after `theme: "light",`, add:

```ts
i18n: { supportedLanguages: { en, th } },
```

(List only the locales whose imports succeeded above.)

Inside `buildConfig({ … })`, after the `globals: []` line, add:

```ts
localization: {
  locales: [/* user's LOCALES array literal */],
  defaultLocale: '/* DEFAULT_LOCALE */',
  fallback: true,
},
```

## 9. Edit `next.config.ts`

Add at the top, after the existing imports:

```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
```

Change the default export from `export default withPayload(nextConfig)` to:

```ts
export default withNextIntl(withPayload(nextConfig))
```

## 10. Replace `src/app/sitemap.ts`

Copy `templates/sitemap.ts` → `src/app/sitemap.ts` (overwrite). It loops `LOCALES` from `@/i18n/config`.

## 11. Add `LocaleSwitcher` primitive

Copy `templates/LocaleSwitcher.tsx` → `src/components/LocaleSwitcher.tsx`. Don't auto-create a `.stories.tsx` — leave that to the user.

## 12. Append `## i18n` section to AGENTS.md

`grep -c '^## i18n' AGENTS.md`. If 0, find the last non-empty line (Read the last 5 lines) and append after it:

```markdown

## i18n

- Locales: <LOCALES joined>. Default: <DEFAULT_LOCALE>. URL strategy: <LOCALE_PREFIX>.
- `src/i18n/messages/<locale>.json` holds UI strings — keep keys identical across all locale files.
- Mark localized Payload fields with `localized: true`. The schema changes — `push` will pick it up.
- Pages receive `params.locale`. Forward it to every `payload.find({ locale })` call.
- Use `useTranslations('namespace')` in components for UI strings.
- The next-intl middleware excludes `/api` and `/admin` from rewriting; never put public pages under those paths.
```

Place this section **before** the `## Project:` section if it exists, otherwise at end of file.

## 13. Print next steps + commit hint

```
□ npm install
□ For each existing collection / global / block: mark localized fields with `localized: true`
□ npm run payload -- generate:types
□ Restart dev — push will sync the new localized columns
□ Translate src/i18n/messages/<locale>.json (English copied as fallback for new locales)
□ Update any existing pages that hard-code text to use useTranslations
```

Then suggest:

```
□ git add . && git commit -m "Add i18n: <locale list>"
```

## Idempotency

Step 1 catches re-runs. Step 12 greps for `## i18n` so the section isn't duplicated. If the user wants a clean retry, they should `git restore` the affected files first.

## Don't

- Don't run `npm install`, `next dev`, or any DB commands — print them, let the user execute.
- Don't auto-translate strings between locales — that's editorial.
- Don't touch existing collection field configs — the user decides which fields go `localized: true` (it's a content design decision, not a mechanical edit).
- Don't add Storybook stories for `LocaleSwitcher` — keep it user-driven.
- Don't move `globals.css` — it stays at `src/app/(frontend)/globals.css`. The new `[locale]/layout.tsx` imports it as `'../globals.css'`.
