import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant =
  | 'default'
  | 'accent'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'border-border bg-surface-2 text-muted',
  accent: 'border-transparent bg-accent-soft text-accent',
  outline: 'border-border text-muted',
  success: 'border-transparent bg-success/12 text-success',
  warning: 'border-transparent bg-warning/12 text-warning',
  danger: 'border-transparent bg-danger/12 text-danger',
  muted: 'border-transparent bg-surface-2 text-faint',
}

interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  className?: string
  children: ReactNode
}

export function Badge({ variant = 'default', dot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
