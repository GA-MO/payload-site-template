import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

type TagProps = {
  mobile?: boolean
  text?: ReactNode
  className?: string
  // When set, the tag renders as a Next Link instead of a span.
  href?: string
}

export function Tag({ mobile = false, text = 'Brand Philosophy', className, href }: TagProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 px-2 py-1 transition-colors',
    'bg-surface-focus hover:bg-base-200',
    mobile ? 'text-xs' : 'text-sm',
    className
  )
  if (href) {
    return (
      <Link href={href} className={classes}>
        {text}
      </Link>
    )
  }
  return <span className={classes}>{text}</span>
}
