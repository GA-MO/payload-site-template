import type { MetadataRoute } from 'next'

import { LOCALES, DEFAULT_LOCALE } from '@/i18n/config'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  // One URL per locale. With localePrefix='as-needed', the default locale lives
  // at `/`; other locales live at `/<locale>`. With 'always', every locale gets
  // its own prefix.
  return LOCALES.map((locale) => ({
    url: locale === DEFAULT_LOCALE ? BASE : `${BASE}/${locale}`,
    lastModified: new Date(),
  }))
}
