import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useData } from '@/hooks'
import { cn } from '@/lib/cn'
import { AppImage, Container, LinkButton, ThemeToggle } from '@/components/ui'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/experience', label: 'Experience' },
  { to: '/blog', label: 'Blog' },
]

export function PublicNavbar() {
  const { settings } = useData()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative text-sm font-medium transition-colors',
      isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
    )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-border bg-background/80 backdrop-blur-xl' : 'border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label={settings.siteName}>
            {settings.logoImageUrl ? (
              <AppImage src={settings.logoImageUrl} alt={settings.siteName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                {settings.logoText?.slice(0, 1) || settings.siteName.slice(0, 1)}
              </span>
            )}
            <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
              {settings.logoText || settings.siteName}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LinkButton to="/contact" size="sm" className="hidden sm:inline-flex">
              Let’s talk
            </LinkButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-foreground md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <Container>
              <div className="flex flex-col gap-1 py-3">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-surface-2 text-foreground' : 'text-muted hover:bg-surface-2 hover:text-foreground',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground"
                >
                  Let’s talk
                </NavLink>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
