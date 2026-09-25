import { createBrowserRouter, Outlet } from 'react-router-dom'
import type { ComponentType } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { ScrollToTop } from '@/components/common/ScrollToTop'

/** Adapt a `export default` page module into a React Router lazy route. */
const page =
  (importer: () => Promise<{ default: ComponentType }>) =>
  async () => ({ Component: (await importer()).default })

/** Root wrapper: resets scroll on navigation, then renders the matched route. */
function Root() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      /* ── Public site ─────────────────────────────────────────── */
      {
        element: <PublicLayout />,
        children: [
          { index: true, lazy: page(() => import('@/pages/public/Home')) },
          { path: 'about', lazy: page(() => import('@/pages/public/About')) },
          { path: 'projects', lazy: page(() => import('@/pages/public/Projects')) },
          { path: 'projects/:slug', lazy: page(() => import('@/pages/public/ProjectDetail')) },
          { path: 'services', lazy: page(() => import('@/pages/public/Services')) },
          { path: 'experience', lazy: page(() => import('@/pages/public/Experience')) },
          { path: 'blog', lazy: page(() => import('@/pages/public/Blog')) },
          { path: 'blog/:slug', lazy: page(() => import('@/pages/public/BlogPost')) },
          { path: 'contact', lazy: page(() => import('@/pages/public/Contact')) },
          { path: 'resume', lazy: page(() => import('@/pages/public/Resume')) },
          { path: '*', lazy: page(() => import('@/pages/public/NotFound')) },
        ],
      },

      /* ── Admin auth (public) ─────────────────────────────────── */
      { path: 'admin/login', lazy: page(() => import('@/pages/admin/AdminLogin')) },

      /* ── Admin CMS (protected) ───────────────────────────────── */
      {
        path: 'admin',
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, lazy: page(() => import('@/pages/admin/Dashboard')) },
              { path: 'projects', lazy: page(() => import('@/pages/admin/Projects')) },
              { path: 'projects/new', lazy: page(() => import('@/pages/admin/ProjectEditor')) },
              { path: 'projects/:id/edit', lazy: page(() => import('@/pages/admin/ProjectEditor')) },
              { path: 'blog', lazy: page(() => import('@/pages/admin/Blog')) },
              { path: 'blog/new', lazy: page(() => import('@/pages/admin/BlogEditor')) },
              { path: 'blog/:id/edit', lazy: page(() => import('@/pages/admin/BlogEditor')) },
              { path: 'skills', lazy: page(() => import('@/pages/admin/Skills')) },
              { path: 'experience', lazy: page(() => import('@/pages/admin/Experience')) },
              { path: 'education', lazy: page(() => import('@/pages/admin/Education')) },
              { path: 'certifications', lazy: page(() => import('@/pages/admin/Certifications')) },
              { path: 'services', lazy: page(() => import('@/pages/admin/Services')) },
              { path: 'testimonials', lazy: page(() => import('@/pages/admin/Testimonials')) },
              { path: 'messages', lazy: page(() => import('@/pages/admin/Messages')) },
              { path: 'profile', lazy: page(() => import('@/pages/admin/Profile')) },
              { path: 'settings', lazy: page(() => import('@/pages/admin/Settings')) },
              { path: '*', lazy: page(() => import('@/pages/public/NotFound')) },
            ],
          },
        ],
      },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
})
