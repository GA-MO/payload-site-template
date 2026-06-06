import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { assertLocalDb } from '../lib/assert-local-db'

describe('assertLocalDb', () => {
  const originalUri = process.env.DATABASE_URI
  const originalEscape = process.env.ALLOW_REMOTE_DB

  beforeEach(() => {
    delete process.env.DATABASE_URI
    delete process.env.ALLOW_REMOTE_DB
  })

  afterEach(() => {
    process.env.DATABASE_URI = originalUri
    process.env.ALLOW_REMOTE_DB = originalEscape
  })

  it('passes for localhost', () => {
    process.env.DATABASE_URI = 'postgres://app:app@localhost:5433/app'
    expect(() => assertLocalDb()).not.toThrow()
  })

  it('passes for 127.0.0.1', () => {
    process.env.DATABASE_URI = 'postgres://app:app@127.0.0.1:5433/app'
    expect(() => assertLocalDb()).not.toThrow()
  })

  it('throws for a remote host', () => {
    process.env.DATABASE_URI = 'postgres://user:pass@prod.example.com:5432/app'
    expect(() => assertLocalDb()).toThrow(/non-local database/i)
  })

  it('throws for an unparseable URI', () => {
    process.env.DATABASE_URI = 'not-a-uri'
    expect(() => assertLocalDb()).toThrow(/non-local database/i)
  })

  it('throws when DATABASE_URI is missing', () => {
    expect(() => assertLocalDb()).toThrow(/non-local database/i)
  })

  it('allows the explicit override only with the magic string', () => {
    process.env.DATABASE_URI = 'postgres://user:pass@prod.example.com:5432/app'
    process.env.ALLOW_REMOTE_DB = 'yes'
    expect(() => assertLocalDb()).toThrow()

    process.env.ALLOW_REMOTE_DB = 'I_KNOW_WHAT_IM_DOING'
    expect(() => assertLocalDb()).not.toThrow()
  })
})
