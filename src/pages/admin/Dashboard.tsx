import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FileText,
  FolderKanban,
  Inbox,
  MessageSquare,
  Plus,
  Star,
  UserRound,
} from 'lucide-react'
import { useData } from '@/hooks'
import { timeAgo } from '@/lib/format'
import { Avatar, Badge, LinkButton } from '@/components/ui'
import { AdminHeader } from '@/components/admin/kit'
import { Seo } from '@/components/common/Seo'

export default function Dashboard() {
  const { profile, projects, blog, messages, skills, services, testimonials } = useData()

  const stats = useMemo(
    () => [
      {
        label: 'Projects',
        value: projects?.length ?? 0,
        sub: `${(projects ?? []).filter((p) => p.published).length} published`,
        icon: FolderKanban,
        to: '/admin/projects',
      },
      {
        label: 'Blog posts',
        value: blog?.length ?? 0,
        sub: `${(blog ?? []).filter((p) => p.status === 'published').length} published`,
        icon: FileText,
        to: '/admin/blog',
      },
      {
        label: 'Messages',
        value: messages?.length ?? 0,
        sub: `${(messages ?? []).filter((m) => m.status === 'unread').length} unread`,
        icon: Inbox,
        to: '/admin/messages',
      },
      {
        label: 'Testimonials',
        value: testimonials?.length ?? 0,
        sub: `${(testimonials ?? []).filter((t) => t.published).length} published`,
        icon: Star,
        to: '/admin/testimonials',
      },
    ],
    [projects, blog, messages, testimonials],
  )

  const recentMessages = useMemo(
    () => [...(messages ?? [])].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')).slice(0, 5),
    [messages],
  )

  const firstName = profile?.fullName?.trim().split(/\s+/)[0] || 'Admin'

  return (
    <>
      <Seo title="Dashboard" noindex />
      <AdminHeader
        title={`Welcome back, ${firstName}`}
        description="Here’s what’s happening across your portfolio."
        action={
          <LinkButton to="/admin/projects/new" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            New project
          </LinkButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent">
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-faint transition-colors group-hover:text-foreground" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-sm font-medium text-foreground">{stat.label}</p>
            <p className="text-xs text-faint">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent messages */}
        <div className="rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold text-foreground">Recent messages</h2>
            <Link to="/admin/messages" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentMessages.map((msg) => (
                <li key={msg.id}>
                  <Link to="/admin/messages" className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2/50">
                    <Avatar name={msg.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{msg.name}</p>
                      <p className="truncate text-xs text-muted">{msg.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {msg.status === 'unread' && <Badge variant="accent">New</Badge>}
                      <span className="text-xs text-faint">{timeAgo(msg.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-3 px-5 py-8 text-sm text-muted">
              <MessageSquare className="h-5 w-5 text-faint" />
              No messages yet.
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[
              { to: '/admin/projects/new', label: 'Add a project', icon: FolderKanban },
              { to: '/admin/blog/new', label: 'Write a post', icon: FileText },
              { to: '/admin/profile', label: 'Edit profile', icon: UserRound },
              { to: '/admin/skills', label: 'Manage skills', icon: Star },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                <action.icon className="h-4 w-4 text-accent" />
                {action.label}
                <ArrowUpRight className="ml-auto h-4 w-4 text-faint" />
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-background-elevated p-4 text-sm">
            <p className="font-medium text-foreground">{skills?.length ?? 0} skills · {services?.length ?? 0} services</p>
            <p className="mt-1 text-xs text-muted">Keep your profile fresh to make the best impression.</p>
          </div>
        </div>
      </div>
    </>
  )
}
