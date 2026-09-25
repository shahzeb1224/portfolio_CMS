import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

/** CSS-only hover/focus tooltip — no portal, positioned relative to the trigger. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background-elevated px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100',
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
        )}
      >
        {content}
      </span>
    </span>
  )
}
