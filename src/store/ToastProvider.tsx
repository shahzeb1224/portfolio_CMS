import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'
import { generateId } from '@/lib/id'
import { cn } from '@/lib/cn'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastContextValue {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const ACCENTS: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-accent',
  warning: 'text-warning',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = generateId('toast')
      setToasts((prev) => [...prev, { ...toast, id }])
      window.setTimeout(() => dismiss(id), 4200)
      return id
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      push,
      dismiss,
      success: (title, description) => void push({ type: 'success', title, description }),
      error: (title, description) => void push({ type: 'error', title, description }),
      info: (title, description) => void push({ type: 'info', title, description }),
      warning: (title, description) => void push({ type: 'warning', title, description }),
    }),
    [toasts, push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-surface/95 p-4 shadow-card backdrop-blur"
                role="alert"
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ACCENTS[toast.type])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-0.5 text-sm text-muted">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 rounded-md p-1 text-faint transition-colors hover:text-foreground"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
