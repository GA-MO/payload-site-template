'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { Caret } from '@/components/icons/Caret'
import { HoverUnderline } from '@/components/HoverUnderline'
import type { DropdownOption } from '@/components/Dropdown'

type DropdownFieldProps = {
  options: DropdownOption[]
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
}

// Form-field custom dropdown: native <select> can't style its option list, so
// the panel is rendered ourselves. Owns open/value state and surfaces required
// + error so it slots into a validated form.
export function DropdownField({
  options,
  name,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select',
  required,
  error,
  className
}: DropdownFieldProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const containerRef = useRef<HTMLDivElement>(null)
  const errorId = useId()

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const selected = options.find((o) => o.value === currentValue)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
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
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {name && <input type='hidden' name={name} value={currentValue} required={required} />}
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='listbox'
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between border-b px-0 text-left transition-colors',
          error ? 'border-state-error' : open ? 'border-typo-primary' : 'border-base-300',
          selected ? 'text-typo-primary' : 'text-typo-muted'
        )}
      >
        <span>{selected?.label ?? placeholder}</span>
        <Caret
          className={cn(
            'text-typo-primary h-1.5 w-2 self-center transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      <div
        role='listbox'
        aria-hidden={!open}
        className={cn(
          'bg-surface-focus absolute top-full left-0 z-20 mt-2 flex w-full flex-col py-2 shadow-lg',
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
              className='group cursor-pointer px-3 py-2 text-left whitespace-nowrap'
            >
              <span className={cn('relative inline-block', isActive && 'underline')}>
                {option.label}
                {!isActive && <HoverUnderline />}
              </span>
            </button>
          )
        })}
      </div>

      {error && (
        <p id={errorId} className='text-state-error mt-1.5 text-sm'>
          {error}
        </p>
      )}
    </div>
  )
}
