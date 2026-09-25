import { forwardRef, type ReactNode } from 'react'
import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const CONTROL =
  'w-full rounded-lg border bg-background-elevated text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60'

export function inputClasses(error?: boolean, className?: string): string {
  return cn(CONTROL, error ? 'border-danger' : 'border-border', className)
}

/* ── Label ────────────────────────────────────────────────────── */
export function Label({
  children,
  required,
  className,
  htmlFor,
}: {
  children: ReactNode
  required?: boolean
  className?: string
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className={cn('text-sm font-medium text-foreground', className)}>
      {children}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  )
}

/* ── Input ────────────────────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, className, ...rest },
  ref,
) {
  return <input ref={ref} className={cn(inputClasses(error), 'h-11 px-3.5', className)} {...rest} />
})

/* ── Textarea ─────────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(inputClasses(error), 'resize-y px-3.5 py-2.5 leading-relaxed', className)}
      {...rest}
    />
  )
})

/* ── Select ───────────────────────────────────────────────────── */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error, className, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(inputClasses(error), 'h-11 appearance-none px-3.5 pr-10', className)}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
    </div>
  )
})

/* ── Switch ───────────────────────────────────────────────────── */
export function Switch({
  checked,
  onChange,
  disabled,
  id,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'border-accent bg-accent' : 'border-border bg-surface-2',
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute left-[1px] top-[1px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}

/* ── Checkbox ─────────────────────────────────────────────────── */
export function Checkbox({
  checked,
  onChange,
  id,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  className?: string
}) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={cn(
        'h-4 w-4 rounded border-border bg-background-elevated text-accent accent-accent focus-visible:outline-none',
        className,
      )}
      style={{ accentColor: 'rgb(var(--accent))' }}
    />
  )
}

/* ── FormField wrapper (label + control + hint/error) ─────────── */
interface FormFieldProps {
  label?: ReactNode
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: ReactNode
  className?: string
  children: ReactNode
}
export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  )
}
