import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { ToastProvider } from '@/store/ToastProvider'
import { DataProvider, useData } from '@/store/DataProvider'
import { ThemeProvider } from '@/store/ThemeProvider'
import { AuthProvider } from '@/store/AuthProvider'
import { router } from '@/routes'

/**
 * Lives inside DataProvider so it can gate Framer Motion on the admin-editable
 * "animations" setting: when disabled we force reduced motion globally, which
 * short-circuits every `motion` component without touching call sites.
 */
function AppRouter() {
  const { settings } = useData()
  return (
    <MotionConfig reducedMotion={settings.appearance.animationsEnabled ? 'user' : 'always'}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </MotionConfig>
  )
}

/**
 * Provider stack (outermost → innermost):
 *   Helmet → Toast → Data → Theme → Auth → Router
 * DataProvider gates rendering until profile + settings load, so everything
 * below it can read the CMS synchronously. ThemeProvider depends on Data
 * (accent comes from settings); Auth wraps the router so ProtectedRoute works.
 */
export default function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <DataProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </ThemeProvider>
        </DataProvider>
      </ToastProvider>
    </HelmetProvider>
  )
}
