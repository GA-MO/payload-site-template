import { cn } from '@/lib/cn'

// The swipe-through underline bar. Drop it inside any `group relative` element
// (button, link, dropdown option…) and it animates on that element's hover:
// the bar enters left→right, and on mouse-out keeps travelling the same way —
// origin flips to the right so it collapses rightward instead of retracting.
export function HoverUnderline({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute right-0 -bottom-0.5 left-0 h-px bg-current',
        'origin-right scale-x-0 transition-transform duration-300',
        'group-hover:origin-left group-hover:scale-x-100',
        className
      )}
    />
  )
}
