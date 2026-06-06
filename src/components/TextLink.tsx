import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { HoverUnderline } from '@/components/HoverUnderline'

type TextLinkProps = {
  children: ReactNode
  className?: string
  // When set, renders a Next Link; otherwise a plain span with just the underline.
  href?: string
}

// Text wrapped with the swipe-through HoverUnderline. Pass `href` for a link,
// omit it for plain text that still gets the hover line.
export function TextLink({ children, className, href }: TextLinkProps) {
  const classes = cn('group relative inline-block', href && 'cursor-pointer', className)
  const content = (
    <>
      {children}
      <HoverUnderline />
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }
  return <span className={classes}>{content}</span>
}
