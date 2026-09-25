import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: ReactNode
  icon?: ReactNode
  badge?: ReactNode
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
  /** Shared layoutId so the active indicator animates between instances. */
  layoutId?: string
}

export function Tabs({ items, value, onChange, className, layoutId = 'tab-indicator' }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 overflow-x-auto border-b border-border no-scrollbar', className)}>
      {items.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'relative flex items-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-foreground' : 'text-muted hover:text-foreground',
            )}
          >
            {item.icon}
            {item.label}
            {item.badge}
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
