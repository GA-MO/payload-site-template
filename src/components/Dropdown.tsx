'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { Caret } from '@/components/icons/Caret'
import { HoverUnderline } from '@/components/HoverUnderline'

export type DropdownOption = {
  value: string
  label: string
}

type DropdownProps = {
  options: DropdownOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Dropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select',
  className
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const containerRef = useRef<HTMLSpanElement>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const selected = options.find((o) => o.value === currentValue)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSelect = (val: string) => {
    if (!isControlled) setInternalValue(val)
    onChange?.(val)
    setOpen(false)
  }

  return (
    <span ref={containerRef} className={cn('relative inline-flex items-baseline', className)}>
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='listbox'
        onClick={() => setOpen((o) => !o)}
        className='border-typo-secondary text-typo-secondary inline-flex cursor-pointer items-baseline gap-2 border-b pb-0.5 transition-colors'
      >
        <span>{selected?.label ?? placeholder}</span>
        <Caret
          className={cn('h-3.5 w-3.5 self-center transition-transform', open && 'rotate-180')}
        />
      </button>
      <div
        role='listbox'
        aria-hidden={!open}
        className={cn(
          'bg-surface-white/80 absolute top-full -left-3 z-10 mt-3 flex min-w-[calc(100%+1.5rem)] flex-col gap-2 px-3 py-2 backdrop-blur-md',
          'transition duration-200 ease-out',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        {options.map((option) => {
          const isActive = option.value === currentValue
          return (
            <button
              key={option.value}
              type='button'
              role='option'
              tabIndex={open ? 0 : -1}
              aria-selected={isActive}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'group block cursor-pointer text-left whitespace-nowrap transition-colors',
                isActive ? 'text-typo-primary' : 'text-typo-secondary hover:text-typo-primary'
              )}
            >
              <span className='relative inline-block'>
                {option.label}
                <HoverUnderline />
              </span>
            </button>
          )
        })}
      </div>
    </span>
  )
}
