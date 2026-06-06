import fs from 'fs'
import path from 'path'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { assertLocalDb } from './lib/assert-local-db'

// Re-feeds every existing image through Payload so the current upload settings
// (resize to 1920 + WebP) apply to files uploaded before those settings existed.
// Payload deletes the old original + size variants as it writes the new ones.
// Note: this permanently downscales originals to 1920px — fine, since the site
// never serves anything larger. Video is left untouched.
const MEDIA_DIR = path.join(process.cwd(), 'media')

async function main() {
  assertLocalDb()
  const payload = await getPayload({ config })

  const { docs } = await payload.find({ collection: 'media', limit: 0, depth: 0 })
  const images = docs.filter((d) => d.mimeType?.startsWith('image/'))
  console.log(`Found ${docs.length} media docs — ${images.length} images to reprocess.\n`)

  let done = 0
  let skipped = 0
  let before = 0
  let after = 0

  for (const doc of images) {
    if (!doc.filename || !doc.mimeType) {
      skipped++
      continue
    }
    const src = path.join(MEDIA_DIR, doc.filename)
    if (!fs.existsSync(src)) {
      console.warn(`· skip ${doc.filename} (file missing on disk)`)
      skipped++
      continue
    }

    const data = fs.readFileSync(src)
    const updated = await payload.update({
      collection: 'media',
      id: doc.id,
      data: {},
      file: { data, mimetype: doc.mimeType, name: doc.filename, size: data.length },
    })

    before += data.length
    after += updated.filesize ?? 0
    done++
    console.log(`✓ ${doc.filename} → ${updated.filename}  (${(data.length / 1024).toFixed(0)}KB → ${((updated.filesize ?? 0) / 1024).toFixed(0)}KB)`)
  }

  console.log(`\nDone — reprocessed ${done}, skipped ${skipped}.`)
  console.log(`Reprocessed originals: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
