import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/ui'
import { adminTitleFor } from './admin-nav'

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation()
  const title = adminTitleFor(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="flex-1 font-display text-lg font-semibold tracking-tight text-foreground">{title}</h1>
      <ThemeToggle />
    </header>
  )
}
