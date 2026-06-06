'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export type ConsentStatus = 'accepted' | 'declined'

type CookieBannerProps = {
  description?: string
  acceptLabel?: string
  declineLabel?: string
  /** Customize to avoid key collisions across projects */
  storageKey?: string
  onAccept?: () => void
  onDecline?: () => void
  className?: string
}

export function CookieBanner({
  description = 'We use cookies to improve your experience.',
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
  storageKey = 'cookie-consent',
  onAccept,
  onDecline,
  className
}: CookieBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return
    const raf = requestAnimationFrame(() => setMounted(true))
    const t = setTimeout(() => setVisible(true), 400)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [storageKey])

  function resolve(choice: ConsentStatus) {
    localStorage.setItem(storageKey, choice)
    setVisible(false)
    setTimeout(() => setMounted(false), 500)
    if (choice === 'accepted') onAccept?.()
    else onDecline?.()
  }

  if (!mounted) return null

  return (
    <div
      role='dialog'
      aria-label='Cookie consent'
      className={cn(
        'fixed right-0 bottom-14 left-0 z-50 md:bottom-12 md:left-auto',
        'transition-all duration-500 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
    >
      <div
        className={cn(
          'bg-surface-mute md:bg-surface-frost flex items-center justify-between gap-6 px-3 py-3 md:backdrop-blur-sm',
          className
        )}
      >
        <p className='text-typo-primary text-xs leading-relaxed md:text-white'>{description}</p>
        <div className='flex shrink-0 items-center gap-5'>
          <button
            onClick={() => resolve('accepted')}
            className='text-typo-primary cursor-pointer text-xs transition-opacity hover:opacity-70 md:text-white'
          >
            {acceptLabel}
          </button>
          <button
            onClick={() => resolve('declined')}
            className='text-typo-muted hover:text-typo-primary cursor-pointer text-xs transition-colors md:text-white/50 md:hover:text-white'
          >
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
