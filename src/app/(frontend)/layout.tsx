import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import 'lenis/dist/lenis.css'
import './globals.css'
import { LenisProvider } from '@/components/providers/LenisProvider'

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className='flex min-h-full flex-col font-sans' suppressHydrationWarning>
        <LenisProvider>
          <Suspense>{children}</Suspense>
        </LenisProvider>
      </body>
    </html>
  )
}
