/**
 * CI gate (Layer 2). Fails if a migration's `up()` contains a data-destroying
 * SQL op (DROP TABLE / DROP COLUMN / TRUNCATE) without an explicit human
 * acknowledgement. This catches an agent that auto-generated a destructive
 * migration and committed it without the deliberate backfill/review.
 *
 * To pass a genuinely-reviewed destructive migration, add a comment to the file:
 *   // reviewed-destructive: <why this is safe — backfill done / data is new / etc.>
 *
 * Only `up()` is scanned: a `down()` reverting an additive migration legitimately
 * drops what `up()` created, so scanning the whole file would flag everything.
 *
 * SQL-level ops only — a destructive Local API call (payload.db.deleteMany) is on
 * the author; this is a backstop for the common auto-generated DROP/TRUNCATE.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'migrations')
const DESTRUCTIVE = /\bDROP\s+TABLE\b|\bDROP\s+COLUMN\b|\bTRUNCATE\b/i
const ACK = /reviewed-destructive:/

function upBody(source: string): string {
  const start = source.search(/export\s+async\s+function\s+up\b/)
  if (start === -1) return source
  const down = source.search(/export\s+async\s+function\s+down\b/)
  return source.slice(start, down === -1 ? undefined : down)
}

const offenders: string[] = []
for (const file of readdirSync(MIGRATIONS_DIR)) {
  if (!file.endsWith('.ts') || file === 'index.ts') continue
  const source = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
  if (DESTRUCTIVE.test(upBody(source)) && !ACK.test(source)) offenders.push(file)
}

if (offenders.length > 0) {
  console.error('✗ Destructive migration(s) without acknowledgement:\n')
  for (const f of offenders) console.error(`  src/migrations/${f}`)
  console.error(
    '\nA migration `up()` drops a table/column or truncates — this deletes production data.\n' +
      'Either rewrite it to preserve data (create new → backfill with req → drop old), or, if the\n' +
      'data loss is intended and reviewed, add a comment to the file:\n' +
      '  // reviewed-destructive: <why this is safe>\n'
  )
  process.exit(1)
}

console.log('✓ No unacknowledged destructive migrations.')
