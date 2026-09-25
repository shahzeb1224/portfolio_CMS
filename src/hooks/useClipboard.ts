import { useCallback, useState } from 'react'

/** Copy text to the clipboard with a transient `copied` flag for UI feedback. */
export function useClipboard(resetAfter = 1600): {
  copied: boolean
  copy: (text: string) => Promise<boolean>
} {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), resetAfter)
        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [resetAfter],
  )

  return { copied, copy }
}
