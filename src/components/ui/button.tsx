import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-premium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-foreground shadow-soft hover:bg-accent-hover active:scale-[0.98]',
  secondary:
    'border border-border bg-surface-2 text-foreground hover:border-border-strong hover:bg-surface active:scale-[0.98]',
  outline:
    'border border-border text-foreground hover:border-border-strong hover:bg-surface-2 active:scale-[0.98]',
  ghost: 'text-muted hover:bg-surface-2 hover:text-foreground',
  danger: 'bg-danger text-white shadow-soft hover:brightness-110 active:scale-[0.98]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
  icon: 'h-10 w-10',
  'icon-sm': 'h-8 w-8',
}

export function buttonClasses(opts?: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}): string {
  return cn(BASE, VARIANTS[opts?.variant ?? 'primary'], SIZES[opts?.size ?? 'md'], opts?.className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading = false, leftIcon, rightIcon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

type LinkButtonProps = LinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/** Router-aware button-styled link for internal navigation. */
export function LinkButton({
  variant,
  size,
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  )
}

type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/** Button-styled anchor for external links. */
export function AnchorButton({
  variant,
  size,
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: AnchorButtonProps) {
  return (
    <a className={buttonClasses({ variant, size, className })} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </a>
  )
}
