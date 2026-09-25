import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to top on route change (skips in-page hash navigation). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}
