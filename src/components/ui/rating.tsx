import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

interface RatingProps {
  value: number
  max?: number
  size?: number
  className?: string
  /** When provided the stars become interactive (admin forms). */
  onChange?: (value: number) => void
}

export function Rating({ value, max = 5, size = 16, className, onChange }: RatingProps) {
  const interactive = typeof onChange === 'function'

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} role={interactive ? 'radiogroup' : 'img'} aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(filled ? 'fill-warning text-warning' : 'fill-transparent text-border-strong')}
          />
        )
        return interactive ? (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1} star${i ? 's' : ''}`}
            onClick={() => onChange!(i + 1)}
            className="rounded transition-transform hover:scale-110"
          >
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        )
      })}
    </div>
  )
}
