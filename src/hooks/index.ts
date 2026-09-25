/**
 * Barrel for hooks. The context hooks are re-exported here so components can
 * import everything from `@/hooks` regardless of where the provider lives.
 */
export { useData } from '@/store/DataProvider'
export type { DataContextValue } from '@/store/DataProvider'
export { useTheme } from '@/store/ThemeProvider'
export { useToast } from '@/store/ToastProvider'
export { useAuth } from '@/store/AuthProvider'

export { useClipboard } from './useClipboard'
export { useMediaQuery } from './useMediaQuery'
export { useDebouncedValue } from './useDebouncedValue'
export { useDisclosure, type Disclosure } from './useDisclosure'
export { useLockBodyScroll } from './useLockBodyScroll'
export { useZodForm } from './useZodForm'
export { useResolvedImage } from './useResolvedImage'
