import { useEffect, useState } from 'react'
import { imageAssetService } from '@/services/imageAssetService'

export interface ResolvedImageState {
  src: string
  loading: boolean
  error: boolean
}

/**
 * Resolves an image reference (which may be a local asset:// reference or standard URL)
 * into a browser-displayable URL.
 */
export function useResolvedImage(source?: string | null): ResolvedImageState {
  const [state, setState] = useState<ResolvedImageState>(() => {
    if (!source) {
      return { src: '', loading: false, error: false }
    }
    if (!source.startsWith('asset://')) {
      return { src: source, loading: false, error: false }
    }
    return { src: '', loading: true, error: false }
  })

  useEffect(() => {
    let active = true

    if (!source) {
      setState({ src: '', loading: false, error: false })
      return
    }

    if (!source.startsWith('asset://')) {
      setState({ src: source, loading: false, error: false })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: false }))

    imageAssetService
      .resolve(source)
      .then((resolvedUrl) => {
        if (!active) return
        if (resolvedUrl) {
          setState({ src: resolvedUrl, loading: false, error: false })
        } else {
          setState({ src: '', loading: false, error: true })
        }
      })
      .catch(() => {
        if (!active) return
        setState({ src: '', loading: false, error: true })
      })

    return () => {
      active = false
    }
  }, [source])

  return state
}
