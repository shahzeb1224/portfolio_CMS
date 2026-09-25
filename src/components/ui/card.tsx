import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  children: ReactNode
}

export function Card({ hover = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface',
        hover &&
          'transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1 p-5 sm:p-6', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-display text-lg font-semibold text-foreground', className)} {...rest}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted', className)} {...rest}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-0 sm:p-6 sm:pt-0', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-3 border-t border-border p-5 sm:p-6', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
