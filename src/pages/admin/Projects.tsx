import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderGit2, ImageIcon, Plus, Star } from 'lucide-react'
import { useData } from '@/hooks'
import type { Project } from '@/types'
import { formatMonthYear } from '@/lib/format'
import { AppImage, Badge, ConfirmDialog, EmptyState, LinkButton } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  AdminHeader,
  FilterTabs,
  ListRow,
  ListShell,
  RowActions,
  StatusBadge,
  Toolbar,
  useCrudList,
} from '@/components/admin'

type ProjectFilter = 'all' | 'published' | 'draft' | 'featured'

const FILTERS: readonly { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'featured', label: 'Featured' },
]

export default function AdminProjects() {
  const { projects, actions } = useData()
  const navigate = useNavigate()
  const list = useCrudList<Project, ProjectFilter>(actions.projects, { label: 'Project', initialFilter: 'all' })

  const filtered = useMemo(() => {
    const q = list.query.trim().toLowerCase()
    return projects.filter((p) => {
      if (list.filter === 'published' && !p.published) return false
      if (list.filter === 'draft' && p.published) return false
      if (list.filter === 'featured' && !p.featured) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [projects, list.query, list.filter])

  const publishedCount = projects.filter((p) => p.published).length

  return (
    <>
      <Seo title="Projects" noindex />
      <AdminHeader
        title="Projects"
        description={`${projects.length} total · ${publishedCount} published`}
        action={
          <LinkButton to="/admin/projects/new" leftIcon={<Plus className="h-4 w-4" />}>
            New project
          </LinkButton>
        }
      />

      <Toolbar
        search={list.query}
        onSearch={list.setQuery}
        placeholder="Search projects…"
        right={<FilterTabs options={FILTERS} value={list.filter} onChange={list.setFilter} />}
      />

      {filtered.length > 0 ? (
        <ListShell>
          {filtered.map((p) => (
            <ListRow key={p.id}>
              <button
                onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
              >
                <Thumb src={p.thumbnail} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                    {p.title}
                    {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {p.category}
                    {p.technologies.length > 0 && ` · ${p.technologies.slice(0, 3).join(', ')}`}
                    {p.completedAt && ` · ${formatMonthYear(p.completedAt)}`}
                  </p>
                </div>
              </button>
              <Badge variant="muted" className="hidden sm:inline-flex">
                {p.technologies.length} tech
              </Badge>
              <StatusBadge published={p.published} />
              <RowActions
                onEdit={() => navigate(`/admin/projects/${p.id}/edit`)}
                onDuplicate={() => list.duplicate(p.id)}
                onDelete={() => list.askDelete(p)}
              />
            </ListRow>
          ))}
        </ListShell>
      ) : (
        <EmptyState
          icon={<FolderGit2 className="h-5 w-5" />}
          title={list.query || list.filter !== 'all' ? 'No matching projects' : 'No projects yet'}
          description={
            list.query || list.filter !== 'all'
              ? 'Try a different search or filter.'
              : 'Create your first case study to showcase your work.'
          }
          action={
            !list.query && list.filter === 'all' ? (
              <LinkButton to="/admin/projects/new" leftIcon={<Plus className="h-4 w-4" />}>
                New project
              </LinkButton>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={!!list.pendingDelete}
        onClose={list.cancelDelete}
        onConfirm={list.confirmDelete}
        loading={list.deleteBusy}
        title="Delete this project?"
        description={list.pendingDelete ? `“${list.pendingDelete.title}” will be permanently removed.` : undefined}
        confirmLabel="Delete"
      />
    </>
  )
}

function Thumb({ src }: { src: string }) {
  return (
    <div className="relative hidden h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-surface-2 sm:block">
      <AppImage
        src={src}
        alt=""
        className="h-full w-full object-cover"
        fallback={
          <div className="grid h-full w-full place-items-center text-faint">
            <ImageIcon className="h-4 w-4" />
          </div>
        }
      />
    </div>
  )
}
