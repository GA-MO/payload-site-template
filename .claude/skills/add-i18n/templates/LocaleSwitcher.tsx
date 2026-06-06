'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { LOCALES } from '@/i18n/config'

// Strips an existing `/<locale>` prefix so we can re-attach the target locale.
// Tolerates both 'as-needed' (no prefix on default) and 'always' shapes.
function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)/)
  if (match && (LOCALES as readonly string[]).includes(match[1])) return match[2] || '/'
  return pathname || '/'
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const current = useLocale()
  const pathname = usePathname()
  const stripped = stripLocale(pathname)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${stripped === '/' ? '' : stripped}`}
          className={cn(
            'text-sm uppercase transition-colors',
            locale === current ? 'text-typo-primary' : 'text-typo-muted hover:text-typo-primary',
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  )
}
