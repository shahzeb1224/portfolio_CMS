export interface AdminNavItem {
  to: string
  label: string
  icon: string
  end?: boolean
  /** Collection key used to show a live count badge (messages → unread). */
  badgeKey?: 'messages'
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
  { to: '/admin/profile', label: 'Profile', icon: 'UserRound' },
  { to: '/admin/projects', label: 'Projects', icon: 'FolderKanban' },
  { to: '/admin/skills', label: 'Skills', icon: 'Cpu' },
  { to: '/admin/experience', label: 'Experience', icon: 'Briefcase' },
  { to: '/admin/education', label: 'Education', icon: 'GraduationCap' },
  { to: '/admin/certifications', label: 'Certifications', icon: 'Award' },
  { to: '/admin/services', label: 'Services', icon: 'Package' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'Quote' },
  { to: '/admin/blog', label: 'Blog', icon: 'FileText' },
  { to: '/admin/messages', label: 'Messages', icon: 'Inbox', badgeKey: 'messages' },
  { to: '/admin/settings', label: 'Settings', icon: 'Settings' },
]

/** Resolve the closest nav item for a given pathname (for the topbar title). */
export function adminTitleFor(pathname: string): string {
  const match = [...ADMIN_NAV]
    .filter((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.label ?? 'Admin'
}
