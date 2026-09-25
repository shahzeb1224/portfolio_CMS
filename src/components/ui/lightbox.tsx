import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLockBodyScroll, useResolvedImage } from '@/hooks'

interface LightboxProps {
  images: string[]
  index: number
  open: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

function LightboxImage({ src }: { src: string }) {
  const { src: resolvedSrc, loading } = useResolvedImage(src)

  if (loading) {
    return (
      <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-white/10 text-white/50">
        Loading…
      </div>
    )
  }

  return (
    <motion.img
      src={resolvedSrc || src}
      alt=""
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  )
}

export function Lightbox({ images, index, open, onClose, onIndexChange }: LightboxProps) {
  useLockBodyScroll(open)
  const count = images.length
  const go = (dir: -1 | 1) => onIndexChange((index + dir + count) % count)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, count])

  return createPortal(
    <AnimatePresence>
      {open && count > 0 && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                aria-label="Previous"
                className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                aria-label="Next"
                className="absolute right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <LightboxImage key={index} src={images[index]} />

          {count > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {index + 1} / {count}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
