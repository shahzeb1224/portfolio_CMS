import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, Copy, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui'

/** Rounded list container with hairline dividers. */
export function ListShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul className={cn('divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface', className)}>
      {children}
    </ul>
  )
}

/** A single list row: content on the left, actions on the right. */
export function ListRow({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={cn('flex items-center gap-4 px-4 py-3 sm:px-5', className)}>{children}</li>
}

interface ReorderControls {
  onUp: () => void
  onDown: () => void
  canUp: boolean
  canDown: boolean
}

export function RowActions({
  onEdit,
  onDuplicate,
  onDelete,
  reorder,
}: {
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  reorder?: ReorderControls
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {reorder && (
        <div className="mr-1 flex flex-col">
          <button
            type="button"
            onClick={reorder.onUp}
            disabled={!reorder.canUp}
            aria-label="Move up"
            className="text-faint transition-colors hover:text-foreground disabled:opacity-25"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reorder.onDown}
            disabled={!reorder.canDown}
            aria-label="Move down"
            className="text-faint transition-colors hover:text-foreground disabled:opacity-25"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDuplicate && (
        <Button variant="ghost" size="icon-sm" onClick={onDuplicate} aria-label="Duplicate">
          <Copy className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          aria-label="Delete"
          className="text-muted hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
