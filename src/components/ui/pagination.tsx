import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}

/** Compact numeric pager with ellipsis for large ranges. */
export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null

  const pages: (number | 'gap')[] = []
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }

  const btn =
    'grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-medium transition-colors disabled:opacity-40'

  return (
    <nav className={cn('flex items-center justify-center gap-1.5', className)} aria-label="Pagination">
      <button
        type="button"
        className={cn(btn, 'border-border text-muted hover:text-foreground')}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-faint">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              btn,
              p === page
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border text-muted hover:text-foreground',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(btn, 'border-border text-muted hover:text-foreground')}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
