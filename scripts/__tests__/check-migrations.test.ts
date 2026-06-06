import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const repoRoot = join(fileURLToPath(import.meta.url), '..', '..', '..')
const scriptPath = join(repoRoot, 'scripts', 'check-migrations.ts')

// Run check-migrations.ts against a temporary src/migrations directory by
// staging a sandbox dir, dropping fixture migrations into it, then invoking
// the script with cwd pointing at the sandbox.
function runCheck(migrationFiles: Record<string, string>): { code: number; stdout: string; stderr: string } {
  const sandbox = mkdtempSync(join(tmpdir(), 'check-mig-'))
  try {
    const migDir = join(sandbox, 'src', 'migrations')
    mkdirSync(migDir, { recursive: true })
    for (const [name, body] of Object.entries(migrationFiles)) {
      writeFileSync(join(migDir, name), body)
    }
    // Copy the script into the sandbox so its relative MIGRATIONS_DIR resolves
    // to sandbox/src/migrations (the script computes it from its own location).
    const scriptDir = join(sandbox, 'scripts')
    mkdirSync(scriptDir, { recursive: true })
    cpSync(scriptPath, join(scriptDir, 'check-migrations.ts'))

    try {
      const stdout = execFileSync('node', ['--import', 'tsx', join(scriptDir, 'check-migrations.ts')], {
        cwd: sandbox,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      return { code: 0, stdout, stderr: '' }
    } catch (err) {
      const e = err as { status?: number; stdout?: string; stderr?: string }
      return { code: e.status ?? 1, stdout: e.stdout ?? '', stderr: e.stderr ?? '' }
    }
  } finally {
    rmSync(sandbox, { recursive: true, force: true })
  }
}

const additive = `
export async function up({ db }: any) {
  await db.execute('CREATE TABLE foo (id serial primary key)')
}
export async function down({ db }: any) {
  await db.execute('DROP TABLE foo')
}
`

const destructiveUnacked = `
export async function up({ db }: any) {
  await db.execute('DROP TABLE legacy_users')
}
export async function down({ db }: any) {
  await db.execute('CREATE TABLE legacy_users (id serial primary key)')
}
`

const destructiveAcked = `
// reviewed-destructive: legacy_users is empty in prod (verified 2026-01-01)
export async function up({ db }: any) {
  await db.execute('DROP TABLE legacy_users')
}
export async function down({ db }: any) {
  await db.execute('CREATE TABLE legacy_users (id serial primary key)')
}
`

describe('check:migrations', () => {
  it('passes when migrations dir is empty', () => {
    const result = runCheck({})
    expect(result.code).toBe(0)
    expect(result.stdout).toMatch(/No unacknowledged destructive migrations/i)
  })

  it('passes for an additive migration (DROP only in down)', () => {
    const result = runCheck({ '20260101_init.ts': additive })
    expect(result.code).toBe(0)
  })

  it('fails for an unacknowledged DROP TABLE in up()', () => {
    const result = runCheck({ '20260102_destructive.ts': destructiveUnacked })
    expect(result.code).toBe(1)
    expect(result.stderr).toMatch(/destructive migration/i)
    expect(result.stderr).toContain('20260102_destructive.ts')
  })

  it('passes when the destructive migration carries the reviewed comment', () => {
    const result = runCheck({ '20260103_acked.ts': destructiveAcked })
    expect(result.code).toBe(0)
  })

  it('ignores index.ts even if it looks destructive', () => {
    const result = runCheck({ 'index.ts': "export const migrations = [] // DROP TABLE noise\n" })
    expect(result.code).toBe(0)
  })
})
