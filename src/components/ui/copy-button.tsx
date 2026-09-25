import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useClipboard } from '@/hooks'

interface CopyButtonProps {
  value: string
  className?: string
  label?: string
}

export function CopyButton({ value, className, label }: CopyButtonProps) {
  const { copied, copy } = useClipboard()
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground',
        className,
      )}
      aria-label={label ?? 'Copy'}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {label && <span>{copied ? 'Copied' : label}</span>}
      {!label && hover && <span>{copied ? 'Copied' : 'Copy'}</span>}
    </button>
  )
}
