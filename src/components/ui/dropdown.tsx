import { type ReactNode, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useDisclosure } from '@/hooks'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
}

/** Lightweight click-to-open menu with outside-click + Escape handling. */
export function Dropdown({ trigger, children, align = 'end', className }: DropdownProps) {
  const { isOpen, toggle, close } = useDisclosure()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  return (
    <div ref={ref} className="relative">
      <div onClick={toggle}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.14 }}
            className={cn(
              'absolute z-50 mt-1.5 min-w-44 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-card',
              align === 'end' ? 'right-0' : 'left-0',
              className,
            )}
            onClick={close}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface DropdownItemProps {
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  children: ReactNode
}

export function DropdownItem({ onClick, icon, danger, disabled, children }: DropdownItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors disabled:opacity-50',
        danger
          ? 'text-danger hover:bg-danger/10'
          : 'text-foreground hover:bg-surface-2',
      )}
    >
      {icon && <span className="shrink-0 text-muted">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return <div className="px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-faint">{children}</div>
}
