import { useState, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { initials as toInitials } from '@/lib/format'
import { useResolvedImage } from '@/hooks/useResolvedImage'

interface AvatarProps {
  src?: string
  name: string
  size?: number
  className?: string
  rounded?: 'full' | 'xl'
}

export function Avatar({ src, name, size = 40, className, rounded = 'full' }: AvatarProps) {
  const { src: resolvedSrc } = useResolvedImage(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const showImage = resolvedSrc && !failed
  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-xl'

  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden border border-border bg-surface-2 text-xs font-semibold text-muted',
        radius,
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={resolvedSrc}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden style={{ fontSize: Math.max(11, size * 0.36) }}>
          {toInitials(name)}
        </span>
      )}
    </span>
  )
}
