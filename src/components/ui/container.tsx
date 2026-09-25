import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Width = 'default' | 'narrow' | 'wide' | 'full'

const WIDTHS: Record<Width, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
}

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: Width
}

export function Container({ width = 'default', className, children, ...rest }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', WIDTHS[width], className)} {...rest}>
      {children}
    </div>
  )
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg'
}

export function Section({ spacing = 'lg', className, children, ...rest }: SectionProps) {
  const pad =
    spacing === 'sm' ? 'py-10 sm:py-14' : spacing === 'md' ? 'py-14 sm:py-20' : 'py-16 sm:py-24'
  return (
    <section className={cn(pad, className)} {...rest}>
      {children}
    </section>
  )
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}

interface SectionHeadingProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  actions?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  actions,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        actions && 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-heading-1 font-semibold text-foreground">{title}</h2>
        {description && (
          <p className={cn('max-w-2xl text-muted', align === 'center' && 'mx-auto')}>{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  )
}
