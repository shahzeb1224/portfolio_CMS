import { Link, NavLink } from 'react-router-dom'
import { LogOut, ExternalLink } from 'lucide-react'
import { useAuth, useData } from '@/hooks'
import { cn } from '@/lib/cn'
import { Icon, Avatar } from '@/components/ui'
import { ADMIN_NAV } from './admin-nav'

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, settings, messages } = useData()
  const { user, logout } = useAuth()
  const unread = messages.filter((m) => m.status === 'unread').length

  return (
    <div className="flex h-full flex-col bg-background-elevated">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
          {settings.logoText?.slice(0, 1) || settings.siteName.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">
            {settings.logoText || settings.siteName}
          </p>
          <p className="text-xs text-faint">Content Studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 no-scrollbar">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface-2 text-foreground'
                  : 'text-muted hover:bg-surface-2/60 hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={item.icon}
                  className={cn('h-[18px] w-[18px]', isActive ? 'text-accent' : 'text-faint group-hover:text-muted')}
                />
                <span className="flex-1">{item.label}</span>
                {item.badgeKey === 'messages' && unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
                    {unread}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <Link
          to="/"
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View live site
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5">
          <Avatar src={user?.avatar || profile.avatar} name={user?.name || profile.fullName} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user?.name || profile.fullName}</p>
            <p className="truncate text-xs text-faint">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-faint transition-colors hover:bg-surface-2 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
