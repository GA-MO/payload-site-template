/**
 * Prod-protection. Destructive scripts (seeds, imports) must only ever run
 * against a local dev database. Production migrations run in CI/deploy, never
 * from a dev machine — so DATABASE_URI here should always be localhost.
 *
 * Call this at the top of `main()` before any `getPayload`/DB call.
 */
export function assertLocalDb() {
  const uri = process.env.DATABASE_URI ?? ''
  const host = (() => {
    try {
      return new URL(uri).hostname
    } catch {
      return ''
    }
  })()
  const isLocal = host === 'localhost' || host === '127.0.0.1'
  if (!isLocal && process.env.ALLOW_REMOTE_DB !== 'I_KNOW_WHAT_IM_DOING') {
    throw new Error(
      `Refusing to run a destructive script against a non-local database (host: ${host || 'unparseable'}). ` +
        `This is prod-protection. If you genuinely mean to, set ALLOW_REMOTE_DB=I_KNOW_WHAT_IM_DOING.`
    )
  }
}
