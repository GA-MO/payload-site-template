import type { CollectionSlug, GlobalSlug } from 'payload'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { assertLocalDb } from './lib/assert-local-db'

// Finds media documents that no content references anywhere — covers, hover
// images, carousel blocks, rich-text uploads, galleries, highlights, etc.
// Works by populating every collection/global, then collecting the id of any
// populated media object (signature: numeric id + mimeType + filename). Anything
// not collected is genuinely unreferenced.
// Dry-run by default; pass --apply to delete (record + files).
const APPLY = process.argv.includes('--apply')

function collectMediaIds(node: unknown, into: Set<number>) {
  if (Array.isArray(node)) {
    for (const v of node) collectMediaIds(v, into)
    return
  }
  if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>
    if (typeof o.id === 'number' && typeof o.mimeType === 'string' && 'filename' in o) {
      into.add(o.id)
    }
    for (const v of Object.values(o)) collectMediaIds(v, into)
  }
}

async function main() {
  assertLocalDb()
  const payload = await getPayload({ config })

  const collectionSlugs = payload.config.collections
    .map((c) => c.slug)
    .filter((s) => s !== 'media') as CollectionSlug[]
  const globalSlugs = payload.config.globals.map((g) => g.slug) as GlobalSlug[]

  const used = new Set<number>()

  for (const slug of collectionSlugs) {
    // draft: true so media referenced only in an unpublished draft still counts.
    const { docs } = await payload.find({ collection: slug, limit: 0, depth: 2, draft: true })
    for (const doc of docs) collectMediaIds(doc, used)
  }
  for (const slug of globalSlugs) {
    const global = await payload.findGlobal({ slug, depth: 2 })
    collectMediaIds(global, used)
  }

  const { docs: media } = await payload.find({ collection: 'media', limit: 0, depth: 0 })
  const unused = media.filter((m) => !used.has(m.id))
  const bytes = unused.reduce((sum, m) => sum + (m.filesize ?? 0), 0)

  console.log(`Media: ${media.length} | referenced: ${used.size} | unused: ${unused.length} (${(bytes / 1024 / 1024).toFixed(1)}MB)\n`)
  for (const m of unused) console.log(`  ${APPLY ? 'delete' : 'unused'}: ${m.filename} (id=${m.id})`)

  if (!APPLY) {
    console.log(`\nDry run — re-run with --apply to delete.`)
    process.exit(0)
  }

  for (const m of unused) await payload.delete({ collection: 'media', id: m.id })
  console.log(`\nDeleted ${unused.length} unused media (${(bytes / 1024 / 1024).toFixed(1)}MB reclaimed).`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
