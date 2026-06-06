import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { TextReveal } from '@/components/TextReveal'

type PageTitleProps = {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <TextReveal as='h1' trigger='load' className={cn('text-3xl md:text-5xl', className)}>
      {children}
    </TextReveal>
  )
}
