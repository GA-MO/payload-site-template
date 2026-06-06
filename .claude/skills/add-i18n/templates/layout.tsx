import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import 'lenis/dist/lenis.css'
import '../globals.css'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { LOCALES, type Locale } from '@/i18n/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-graphik',
  display: 'swap'
})

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const SITE_TITLE = 'Payload Site Template'
const SITE_DESCRIPTION = 'A Figma + Payload + Next.js starter.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(LOCALES as readonly string[]).includes(locale)) notFound()

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className='flex min-h-full flex-col font-sans' suppressHydrationWarning>
        <NextIntlClientProvider locale={locale as Locale}>
          <LenisProvider>
            <Suspense>{children}</Suspense>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
