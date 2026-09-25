import { Link } from 'react-router-dom'
import { useData } from '@/hooks'
import { Container } from '@/components/ui'
import { SocialLinks } from '@/components/common/SocialLinks'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { to: '/about', label: 'About' },
      { to: '/projects', label: 'Work' },
      { to: '/services', label: 'Services' },
      { to: '/experience', label: 'Experience' },
    ],
  },
  {
    title: 'More',
    links: [
      { to: '/blog', label: 'Blog' },
      { to: '/resume', label: 'Resume' },
      { to: '/contact', label: 'Contact' },
    ],
  },
]

export function PublicFooter() {
  const { profile, settings } = useData()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border bg-background-elevated">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link to="/" className="font-display text-lg font-semibold tracking-tight text-foreground">
              {settings.logoText || settings.siteName}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">{profile.shortBio}</p>
            <SocialLinks links={profile.social} className="mt-5" />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 sm:flex-row">
          <p className="text-xs text-faint">
            © {year} {profile.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-faint">
            {profile.available ? 'Available for new projects' : 'Currently booked'}
          </p>
        </div>
      </Container>
    </footer>
  )
}
