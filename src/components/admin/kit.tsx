import { useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Button, Input, Badge } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useToast } from '@/hooks'
import { toErrorMessage } from '@/lib/errors'

/** Page title row for admin screens. */
export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** Search + right-aligned controls above a list. */
export function Toolbar({
  search,
  onSearch,
  placeholder = 'Search…',
  right,
  className,
}: {
  search: string
  onSearch: (value: string) => void
  placeholder?: string
  right?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center gap-3', className)}>
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder} className="pl-9" />
      </div>
      {right}
    </div>
  )
}

/** Segmented filter buttons (e.g. All / Published / Drafts) above a list. */
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
            value === o.value
              ? 'border-accent bg-accent-soft text-accent'
              : 'border-border text-muted hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Simple two-column responsive grid for form fields. */
export function FieldGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>
}

/** Titled card that groups a section of a long settings/profile form. */
export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-2xl border border-border bg-surface p-5 sm:p-6', className)}>
      <div className="mb-5">
        <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/** Published / Draft pill used across list rows. */
export function StatusBadge({ published, labels }: { published: boolean; labels?: [on: string, off: string] }) {
  const [on, off] = labels ?? ['Published', 'Draft']
  return <Badge variant={published ? 'success' : 'muted'}>{published ? on : off}</Badge>
}

/** Sticky Save / Cancel bar for modal editor forms. */
export function EditorActions({
  onCancel,
  saving,
  submitLabel = 'Save',
}: {
  onCancel: () => void
  saving: boolean
  submitLabel?: string
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 -mb-4 mt-6 flex items-center justify-end gap-2.5 border-t border-border bg-surface px-5 py-3">
      <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
        Cancel
      </Button>
      <Button type="submit" loading={saving}>
        {submitLabel}
      </Button>
    </div>
  )
}

/**
 * Save orchestration shared by every editor: toggles a busy flag, runs the
 * mutation, toasts success/failure, and calls `onDone` only when it succeeds.
 */
export function useSave(entityLabel: string) {
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const run = async (isEdit: boolean, fn: () => Promise<unknown>, onDone: () => void) => {
    setSaving(true)
    try {
      await fn()
      toast.success(`${entityLabel} ${isEdit ? 'updated' : 'created'}`)
      onDone()
    } catch (err) {
      toast.error('Something went wrong', toErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }
  return { saving, run }
}
