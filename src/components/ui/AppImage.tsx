import { useState, useEffect, type ReactNode, type ImgHTMLAttributes } from 'react'
import { ImageIcon } from 'lucide-react'
import { useResolvedImage } from '@/hooks/useResolvedImage'
import { cn } from '@/lib/cn'

export interface AppImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  fallback?: ReactNode
  containerClassName?: string
}

export function AppImage({
  src,
  alt = '',
  className,
  containerClassName,
  fallback,
  loading = 'lazy',
  onError,
  ...rest
}: AppImageProps) {
  const { src: resolvedSrc, loading: resolving, error: resolveError } = useResolvedImage(src)
  const [imgError, setImgError] = useState(false)

  // Reset broken image state when src changes
  useEffect(() => {
    setImgError(false)
  }, [src])

  const hasImage = Boolean(resolvedSrc && !imgError && !resolveError)

  const defaultFallback = (
    <div className="grid h-full w-full place-items-center bg-surface-2 text-faint">
      <ImageIcon className="h-6 w-6" />
    </div>
  )

  if (resolving) {
    return (
      <div className={cn('relative overflow-hidden bg-surface-2 animate-pulse', containerClassName)}>
        <div className="grid h-full w-full place-items-center text-faint opacity-50">
          <ImageIcon className="h-6 w-6" />
        </div>
      </div>
    )
  }

  if (!hasImage) {
    return fallback ? <>{fallback}</> : <div className={cn('h-full w-full', containerClassName)}>{defaultFallback}</div>
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        setImgError(true)
        onError?.(e)
      }}
      {...rest}
    />
  )
}
