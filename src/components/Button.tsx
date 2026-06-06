import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ArrowDiagonal, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@/components/icons/Arrow'
import { HoverUnderline } from '@/components/HoverUnderline'

export type ButtonArrow = 'right' | 'left' | 'up' | 'down' | 'diagonal'

const ARROW_ICON: Record<ButtonArrow, typeof ArrowDiagonal> = {
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  down: ArrowDown,
  diagonal: ArrowDiagonal
}

type ButtonVariant = 'external' | 'internal' | 'primary'

// external: muted text link, turns primary on hover.
// internal: primary text on a hover background, arrow slides in.
// primary:  external's look but primary at rest (no hover color change).
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  external: 'text-typo-muted hover:text-typo-primary px-0',
  internal: 'text-typo-primary hover:bg-base-100 rounded-sm',
  primary: 'text-typo-primary px-0'
}

type CommonProps = {
  variant?: ButtonVariant
  size?: 'lg' | 'md'
  showArrow?: boolean
  arrow?: ButtonArrow
  text?: ReactNode
}

// Pass `href` to render a real link (works in server components, correct for
// navigation); omit it for an onClick button.
type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
  )

export function Button({
  variant = 'external',
  size = 'lg',
  showArrow = true,
  arrow = 'diagonal',
  text = 'Text message',
  className,
  ...props
}: ButtonProps) {
  const ArrowIcon = ARROW_ICON[arrow]
  // The text-link variants get the swipe underline; internal owns the hover bg + arrow.
  const showUnderline = variant !== 'internal'
  const classes = cn(
    'group inline-flex cursor-pointer items-center gap-0.5 px-2 py-0.5 transition-colors',
    size === 'lg' && 'text-lg',
    VARIANT_CLASSES[variant],
    className
  )
  const content = (
    <>
      <span className={cn(showUnderline && 'relative')}>
        {text}
        {showUnderline && <HoverUnderline />}
      </span>
      {showArrow && (
        <ArrowIcon
          size={size === 'lg' ? 24 : 18}
          className={cn(
            'transition-all duration-200',
            variant === 'internal' &&
              '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
          )}
        />
      )}
    </>
  )

  if (props.href !== undefined) {
    return (
      <a {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {content}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button {...buttonProps} type={type} className={classes}>
      {content}
    </button>
  )
}
