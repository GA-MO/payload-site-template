import fs from 'fs'
import path from 'path'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { assertLocalDb } from './lib/assert-local-db'

// Removes files in the media dir that no media document references — leftovers
// from records deleted or re-seeded outside Payload's own file cleanup.
// Dry-run by default; pass --apply to actually delete.
const MEDIA_DIR = path.join(process.cwd(), 'media')
const APPLY = process.argv.includes('--apply')
const SIZE_KEYS = ['thumbnail', 'card', 'feature'] as const

async function main() {
  assertLocalDb()
  const payload = await getPayload({ config })

  const { docs } = await payload.find({ collection: 'media', limit: 0, depth: 0 })

  const referenced = new Set<string>()
  for (const doc of docs) {
    if (doc.filename) referenced.add(doc.filename)
    for (const key of SIZE_KEYS) {
      const size = doc.sizes?.[key]
      if (size?.filename) referenced.add(size.filename)
    }
  }

  const onDisk = fs.readdirSync(MEDIA_DIR).filter((f) => !f.startsWith('.'))
  const orphans = onDisk.filter((f) => !referenced.has(f))
  const bytes = orphans.reduce((sum, f) => sum + fs.statSync(path.join(MEDIA_DIR, f)).size, 0)

  console.log(`On disk: ${onDisk.length} | referenced: ${referenced.size} | orphans: ${orphans.length} (${(bytes / 1024 / 1024).toFixed(1)}MB)\n`)
  for (const f of orphans) console.log(`  ${APPLY ? 'delete' : 'orphan'}: ${f}`)

  if (!APPLY) {
    console.log(`\nDry run — re-run with --apply to delete.`)
    process.exit(0)
  }

  for (const f of orphans) fs.unlinkSync(path.join(MEDIA_DIR, f))
  console.log(`\nDeleted ${orphans.length} orphan files — reclaimed ${(bytes / 1024 / 1024).toFixed(1)}MB.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
