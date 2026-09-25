import { Outlet } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'
import { PublicFooter } from './PublicFooter'
import { BackToTop } from '@/components/common/BackToTop'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <BackToTop />
    </div>
  )
}
